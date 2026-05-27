-- ============================================================
-- Jazz MIDI - Initial Schema
-- ============================================================

-- Profiles: one row per auth user, mirrors auth.users
create table public.profiles (
  id                  uuid        references auth.users on delete cascade primary key,
  name                text        not null default 'Jazz Student',
  avatar              text,
  level               integer     not null default 1,
  experience_points   integer     not null default 0,
  total_practice_time integer     not null default 0, -- minutes
  created_at          timestamptz not null default now(),
  last_activity       timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: select own"  on public.profiles for select  using (auth.uid() = id);
create policy "profiles: insert own"  on public.profiles for insert  with check (auth.uid() = id);
create policy "profiles: update own"  on public.profiles for update  using (auth.uid() = id);

-- User stats: full statistics blob as JSONB
create table public.user_stats (
  user_id    uuid        references public.profiles on delete cascade primary key,
  stats      jsonb       not null default '{}',
  updated_at timestamptz not null default now()
);

alter table public.user_stats enable row level security;

create policy "user_stats: select own"  on public.user_stats for select  using (auth.uid() = user_id);
create policy "user_stats: insert own"  on public.user_stats for insert  with check (auth.uid() = user_id);
create policy "user_stats: update own"  on public.user_stats for update  using (auth.uid() = user_id);

-- Journey progress: curriculum unit/lesson state
create table public.journey_progress (
  user_id    uuid        references public.profiles on delete cascade primary key,
  progress   jsonb       not null default '[]',
  updated_at timestamptz not null default now()
);

alter table public.journey_progress enable row level security;

create policy "journey_progress: select own"  on public.journey_progress for select  using (auth.uid() = user_id);
create policy "journey_progress: insert own"  on public.journey_progress for insert  with check (auth.uid() = user_id);
create policy "journey_progress: update own"  on public.journey_progress for update  using (auth.uid() = user_id);

-- Auto-create profile row when a new auth user is created
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', 'Jazz Student'));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
