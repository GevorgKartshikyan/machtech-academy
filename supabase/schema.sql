-- ============================================================================
-- MachTech Academy — Supabase Postgres Schema
-- Run this in your Supabase project's SQL editor BEFORE seed.sql
-- ============================================================================

-- Enable required extensions
create extension if not exists "pgcrypto";

-- ============================================================================
-- USERS — managed by us, not Supabase Auth (we control passwords with bcrypt)
-- ============================================================================
create table if not exists public.users (
  id            uuid primary key default gen_random_uuid(),
  email         text unique not null,
  password_hash text not null,
  full_name     text,
  phone         text,
  role          text not null default 'student' check (role in ('student','admin')),
  group_ids     uuid[] default '{}',
  access_grants text[] default '{}',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_users_email on public.users(email);
create index if not exists idx_users_role  on public.users(role);

-- ============================================================================
-- COURSES — top-level course catalog
-- ============================================================================
create table if not exists public.courses (
  id           text primary key,                          -- e.g. 'crm-foundation'
  title        text not null,
  short_title  text,
  description  text,
  level        text default 'Foundation',
  icon         text default '📘',
  status       text not null default 'draft' check (status in ('draft','published')),
  access_mode  text not null default 'open'  check (access_mode in ('open','restricted')),
  position     int  not null default 0,
  final_def    jsonb default '{"theory":[],"logic":[],"practical":[]}'::jsonb,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists idx_courses_status on public.courses(status);
create index if not exists idx_courses_pos    on public.courses(position);

-- ============================================================================
-- MODULES — ordered modules per course
-- ============================================================================
create table if not exists public.modules (
  id          text primary key,                           -- e.g. 'm1'
  course_id   text not null references public.courses(id) on delete cascade,
  n           int  not null,                              -- display order, 1-indexed
  title       text not null,
  duration    text default '20 րոպե',
  description text,
  blocks      jsonb default '[]'::jsonb,
  quiz        jsonb default '[]'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists idx_modules_course on public.modules(course_id, n);

-- ============================================================================
-- ENROLLMENTS — user's enrollment in a course
-- ============================================================================
create table if not exists public.enrollments (
  user_id       uuid not null references public.users(id)   on delete cascade,
  course_id     text not null references public.courses(id) on delete cascade,
  enrolled_at   timestamptz not null default now(),
  progress      jsonb default '{}'::jsonb,    -- { "m1": true, "m2": true }
  quiz_scores   jsonb default '{}'::jsonb,    -- { "m1": 80 }
  quiz_locked   jsonb default '{}'::jsonb,    -- { "m1": true }
  practice      jsonb,                        -- { text, at, score, feedback }
  final_result  jsonb,                        -- { theoryPct, logicPct, ... }
  updated_at    timestamptz not null default now(),
  primary key (user_id, course_id)
);

create index if not exists idx_enr_user   on public.enrollments(user_id);
create index if not exists idx_enr_course on public.enrollments(course_id);

-- ============================================================================
-- GROUPS — admin-defined student groups (e.g. "October cohort")
-- ============================================================================
create table if not exists public.groups (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  color      text default '#27D2B3',
  created_at timestamptz not null default now()
);

-- ============================================================================
-- I18N OVERRIDES — single-row table holding the JSONB overrides
-- ============================================================================
create table if not exists public.i18n_overrides (
  id         int primary key default 1,
  overrides  jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint i18n_single_row check (id = 1)
);

insert into public.i18n_overrides (id, overrides) values (1, '{}'::jsonb)
on conflict (id) do nothing;

-- ============================================================================
-- AUTO-UPDATE TRIGGER for updated_at
-- ============================================================================
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

do $$ begin
  create trigger trg_users_touch        before update on public.users        for each row execute function public.touch_updated_at();
  create trigger trg_courses_touch      before update on public.courses      for each row execute function public.touch_updated_at();
  create trigger trg_modules_touch      before update on public.modules      for each row execute function public.touch_updated_at();
  create trigger trg_enrollments_touch  before update on public.enrollments  for each row execute function public.touch_updated_at();
  create trigger trg_i18n_touch         before update on public.i18n_overrides for each row execute function public.touch_updated_at();
exception when duplicate_object then null; end $$;

-- ============================================================================
-- ROW LEVEL SECURITY
-- We use server-side API routes (with service-role key), so RLS protects against
-- direct anon-key access. Public read-only access to published courses/modules is open.
-- ============================================================================
alter table public.users          enable row level security;
alter table public.courses        enable row level security;
alter table public.modules        enable row level security;
alter table public.enrollments    enable row level security;
alter table public.groups         enable row level security;
alter table public.i18n_overrides enable row level security;

-- Public can read published courses + their modules (for landing page)
drop policy if exists "public read published courses" on public.courses;
create policy "public read published courses" on public.courses
  for select to anon, authenticated
  using (status = 'published');

drop policy if exists "public read modules of published courses" on public.modules;
create policy "public read modules of published courses" on public.modules
  for select to anon, authenticated
  using (exists (select 1 from public.courses c where c.id = course_id and c.status = 'published'));

-- Public can read i18n overrides (the landing page needs them)
drop policy if exists "public read i18n" on public.i18n_overrides;
create policy "public read i18n" on public.i18n_overrides
  for select to anon, authenticated using (true);

-- All writes + sensitive reads go through service-role key (server only)
-- No other policies needed because service_role bypasses RLS.
