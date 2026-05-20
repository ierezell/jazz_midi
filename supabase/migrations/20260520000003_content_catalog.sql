-- ============================================================
-- Migration 003: Content Catalog + Supabase Storage bucket
-- Stores all exercise/song metadata with tier gating support
-- ============================================================

-- ── Enums ────────────────────────────────────────────────────
create type content_category as enum (
  'lick',
  'song',
  'rhythm',
  'hand_independence'
);

create type content_difficulty as enum (
  'beginner',
  'intermediate',
  'advanced'
);

create type content_tier as enum (
  'free',
  'basic',
  'premium'
);

-- ── Main catalog table ────────────────────────────────────────
create table public.content_catalog (
  id            text               primary key,
  -- e.g. 'bebop-enclosure', 'autumn-leaves', 'blues-shuffle'

  name          text               not null,
  description   text               not null default '',

  category      content_category   not null,
  -- subcategory within the category (e.g. 'bebop', 'blues', 'jazz')
  subcategory   text,

  difficulty    content_difficulty,
  tier          content_tier       not null default 'free',

  -- Path inside the Supabase Storage bucket 'exercise-content'
  -- e.g. 'licks/bebop-enclosure.musicxml'
  storage_path  text               not null,

  -- Fallback static URL (kept while migrating)
  -- e.g. '/licks/bebop-enclosure.musicxml'
  static_url    text,

  -- Category-specific metadata (bpm, key, composer, chords, tags…)
  metadata      jsonb              not null default '{}',

  -- Ordering within category
  sort_order    integer            not null default 0,

  created_at    timestamptz        not null default now(),
  updated_at    timestamptz        not null default now()
);

-- Auto-update updated_at
create or replace function public.update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger content_catalog_updated_at
  before update on public.content_catalog
  for each row execute function public.update_updated_at();

-- Indexes for common query patterns
create index idx_content_catalog_category    on public.content_catalog (category);
create index idx_content_catalog_tier        on public.content_catalog (tier);
create index idx_content_catalog_difficulty  on public.content_catalog (difficulty);
create index idx_content_catalog_category_tier
  on public.content_catalog (category, tier);

-- Full-text search on name + description
create index idx_content_catalog_fts
  on public.content_catalog
  using gin (to_tsvector('english', name || ' ' || description));

-- GIN index on tags array inside metadata JSONB
create index idx_content_catalog_tags
  on public.content_catalog
  using gin ((metadata -> 'tags'));

-- ── Add subscription_tier to profiles first (policies depend on it) ──────────
alter table public.profiles
  add column if not exists subscription_tier text not null default 'free'
    check (subscription_tier in ('free', 'basic', 'premium'));

create index if not exists idx_profiles_subscription_tier
  on public.profiles (subscription_tier);

-- ── RLS ──────────────────────────────────────────────────────
alter table public.content_catalog enable row level security;

-- Free content is readable by everyone (authenticated users)
create policy "free content readable by authenticated"
  on public.content_catalog
  for select
  to authenticated
  using (tier = 'free');

-- Basic tier: authenticated users who have 'basic' or 'premium' profile
create policy "basic content readable by basic tier"
  on public.content_catalog
  for select
  to authenticated
  using (
    tier = 'basic'
    and exists (
      select 1 from public.profiles
      where id = (select auth.uid())
      and subscription_tier in ('basic', 'premium')
    )
  );

-- Premium tier
create policy "premium content readable by premium tier"
  on public.content_catalog
  for select
  to authenticated
  using (
    tier = 'premium'
    and exists (
      select 1 from public.profiles
      where id = (select auth.uid())
      and subscription_tier = 'premium'
    )
  );

-- ── Supabase Storage bucket ───────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'exercise-content',
  'exercise-content',
  true,             -- public: free content served without signed URLs
  5242880,          -- 5 MB per file
  array[
    'application/xml',
    'text/xml',
    'text/plain'    -- some servers serve .musicxml as text/plain
  ]
)
on conflict (id) do nothing;

-- Storage RLS: anyone authenticated can read
create policy "authenticated users can read exercise content"
  on storage.objects
  for select
  to authenticated
  using (bucket_id = 'exercise-content');

-- Only service role can insert/update/delete (upload script uses service key)
create policy "service role can manage exercise content"
  on storage.objects
  for all
  to service_role
  using (bucket_id = 'exercise-content');
