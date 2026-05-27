-- ============================================================
-- Jazz MIDI — Normalize schema (replace JSONB blobs)
-- ============================================================

-- Drop old JSONB tables from initial migration
drop table if exists public.user_stats;
drop table if exists public.journey_progress;

-- ── Types ────────────────────────────────────────────────────

create type public.exercise_type as enum (
  'chord','scale','interval','II-V-I','progression',
  'note','partition','rhythm','hand_independence','dexterity'
);

create type public.stat_mastery_level as enum ('beginner','intermediate','advanced','expert');
create type public.note_mastery_level as enum ('beginner','intermediate','advanced','mastered');
create type public.unit_status       as enum ('locked','active','completed');

-- ── user_stats (flat scalar fields per user) ─────────────────

create table public.user_stats (
  user_id             uuid        references public.profiles on delete cascade primary key,
  total_exercises     integer     not null default 0,
  completed_exercises integer     not null default 0,
  average_accuracy    numeric(6,2) not null default 0,
  average_score       numeric(6,2) not null default 0,
  total_practice_time numeric(12,2) not null default 0,  -- minutes
  current_streak      integer     not null default 0,
  longest_streak      integer     not null default 0,
  improvement_trend   numeric(6,2) not null default 0,
  updated_at          timestamptz not null default now()
);

alter table public.user_stats enable row level security;

create policy "user_stats: select own" on public.user_stats
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "user_stats: insert own" on public.user_stats
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "user_stats: update own" on public.user_stats
  for update to authenticated
  using  ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- ── exercise_type_stats (one row per user × exercise type) ───

create table public.exercise_type_stats (
  user_id          uuid references public.profiles on delete cascade,
  exercise_type    public.exercise_type not null,
  attempted        integer      not null default 0,
  completed        integer      not null default 0,
  average_accuracy numeric(6,2) not null default 0,
  average_score    numeric(6,2) not null default 0,
  best_score       numeric(6,2) not null default 0,
  total_time       numeric(12,2) not null default 0,
  mastery_level    public.stat_mastery_level not null default 'beginner',
  avg_deviation_ms numeric(10,2),
  updated_at       timestamptz  not null default now(),
  primary key (user_id, exercise_type)
);

alter table public.exercise_type_stats enable row level security;

create policy "exercise_type_stats: select own" on public.exercise_type_stats
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "exercise_type_stats: insert own" on public.exercise_type_stats
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "exercise_type_stats: update own" on public.exercise_type_stats
  for update to authenticated
  using  ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- ── note_progress (one row per user × note_key) ──────────────

create table public.note_progress (
  user_id          uuid references public.profiles on delete cascade,
  note_key         text         not null,
  note             text         not null,
  exercise_type    public.exercise_type not null,
  chord_type       text,
  attempts         integer      not null default 0,
  successes        integer      not null default 0,
  average_accuracy numeric(6,2) not null default 0,
  best_time        numeric(10,2) not null default 0,
  last_practiced   timestamptz  not null default now(),
  mastery_level    public.note_mastery_level not null default 'beginner',
  primary key (user_id, note_key)
);

alter table public.note_progress enable row level security;

create policy "note_progress: select own" on public.note_progress
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "note_progress: insert own" on public.note_progress
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "note_progress: update own" on public.note_progress
  for update to authenticated
  using  ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- ── missed_notes (one row per user × note_key) ───────────────

create table public.missed_notes (
  user_id       uuid references public.profiles on delete cascade,
  note_key      text    not null,
  exercise_type text    not null,
  count         integer not null default 0,
  last_missed   timestamptz not null default now(),
  primary key (user_id, note_key)
);

alter table public.missed_notes enable row level security;

create policy "missed_notes: select own" on public.missed_notes
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "missed_notes: insert own" on public.missed_notes
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "missed_notes: update own" on public.missed_notes
  for update to authenticated
  using  ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- ── missed_chords (one row per user × chord_key) ─────────────

create table public.missed_chords (
  user_id       uuid references public.profiles on delete cascade,
  chord_key     text    not null,
  exercise_type text    not null,
  count         integer not null default 0,
  last_missed   timestamptz not null default now(),
  primary key (user_id, chord_key)
);

alter table public.missed_chords enable row level security;

create policy "missed_chords: select own" on public.missed_chords
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "missed_chords: insert own" on public.missed_chords
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "missed_chords: update own" on public.missed_chords
  for update to authenticated
  using  ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- ── practice_calendar (one row per user × date) ──────────────

create table public.practice_calendar (
  user_id             uuid references public.profiles on delete cascade,
  practice_date       date    not null,
  exercises_completed integer not null default 0,
  practice_time       numeric(10,2) not null default 0,
  primary key (user_id, practice_date)
);

alter table public.practice_calendar enable row level security;

create policy "practice_calendar: select own" on public.practice_calendar
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "practice_calendar: insert own" on public.practice_calendar
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "practice_calendar: update own" on public.practice_calendar
  for update to authenticated
  using  ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- ── chord_mastery (one row per user × root × chord_type) ─────

create table public.chord_mastery (
  user_id          uuid references public.profiles on delete cascade,
  root             text         not null,
  chord_type       text         not null,
  mastery_level    integer      not null default 0,
  attempts_count   integer      not null default 0,
  best_score       numeric(6,2) not null default 0,
  average_accuracy numeric(6,2) not null default 0,
  last_practiced   timestamptz  not null default now(),
  is_learning      boolean      not null default true,
  is_mastered      boolean      not null default false,
  primary key (user_id, root, chord_type)
);

alter table public.chord_mastery enable row level security;

create policy "chord_mastery: select own" on public.chord_mastery
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "chord_mastery: insert own" on public.chord_mastery
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "chord_mastery: update own" on public.chord_mastery
  for update to authenticated
  using  ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- ── scale_mastery (one row per user × root × scale_type) ─────

create table public.scale_mastery (
  user_id          uuid references public.profiles on delete cascade,
  root             text         not null,
  scale_type       text         not null,
  mastery_level    integer      not null default 0,
  attempts_count   integer      not null default 0,
  best_score       numeric(6,2) not null default 0,
  average_accuracy numeric(6,2) not null default 0,
  last_practiced   timestamptz  not null default now(),
  is_learning      boolean      not null default true,
  is_mastered      boolean      not null default false,
  primary key (user_id, root, scale_type)
);

alter table public.scale_mastery enable row level security;

create policy "scale_mastery: select own" on public.scale_mastery
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "scale_mastery: insert own" on public.scale_mastery
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "scale_mastery: update own" on public.scale_mastery
  for update to authenticated
  using  ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- ── progression_mastery (one row per user × key × type) ──────

create table public.progression_mastery (
  user_id          uuid references public.profiles on delete cascade,
  key              text         not null,
  progression_type text         not null,
  mastery_level    integer      not null default 0,
  attempts_count   integer      not null default 0,
  best_score       numeric(6,2) not null default 0,
  average_accuracy numeric(6,2) not null default 0,
  last_practiced   timestamptz  not null default now(),
  is_learning      boolean      not null default true,
  is_mastered      boolean      not null default false,
  primary key (user_id, key, progression_type)
);

alter table public.progression_mastery enable row level security;

create policy "progression_mastery: select own" on public.progression_mastery
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "progression_mastery: insert own" on public.progression_mastery
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "progression_mastery: update own" on public.progression_mastery
  for update to authenticated
  using  ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- ── practice_sessions (one row per session) ──────────────────

create table public.practice_sessions (
  id                  uuid        default gen_random_uuid() primary key,
  user_id             uuid        references public.profiles on delete cascade,
  session_date        timestamptz not null default now(),
  duration            numeric(10,2) not null default 0,
  exercises_completed integer     not null default 0,
  average_score       numeric(6,2) not null default 0,
  top_category        text,
  improvements        text[]
);

create index on public.practice_sessions (user_id, session_date desc);

alter table public.practice_sessions enable row level security;

create policy "practice_sessions: select own" on public.practice_sessions
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "practice_sessions: insert own" on public.practice_sessions
  for insert to authenticated with check ((select auth.uid()) = user_id);

-- ── unit_progress (one row per user × unit_id) ───────────────

create table public.unit_progress (
  user_id   uuid                  references public.profiles on delete cascade,
  unit_id   text                  not null,
  status    public.unit_status    not null default 'locked',
  primary key (user_id, unit_id)
);

alter table public.unit_progress enable row level security;

create policy "unit_progress: select own" on public.unit_progress
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "unit_progress: insert own" on public.unit_progress
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "unit_progress: update own" on public.unit_progress
  for update to authenticated
  using  ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- ── lesson_progress (one row per user × lesson_id) ───────────

create table public.lesson_progress (
  user_id             uuid    references public.profiles on delete cascade,
  lesson_id           text    not null,
  completed           boolean not null default false,
  stars               integer not null default 0,
  perfect_completions integer not null default 0,
  primary key (user_id, lesson_id)
);

alter table public.lesson_progress enable row level security;

create policy "lesson_progress: select own" on public.lesson_progress
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "lesson_progress: insert own" on public.lesson_progress
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "lesson_progress: update own" on public.lesson_progress
  for update to authenticated
  using  ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
