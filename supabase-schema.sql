-- ==========================================
-- ONLINE CODE COMPILER SUPABASE SCHEMA (v4 - Final with Realtime)
-- ==========================================

-- 1. DROP EXISTING POLICIES (To avoid "Already Exists" error)
DROP POLICY IF EXISTS "Anyone can view progress" ON public.user_progress;
DROP POLICY IF EXISTS "Anyone can view submissions" ON public.code_submissions;
DROP POLICY IF EXISTS "Users can insert own submissions" ON public.code_submissions;
DROP POLICY IF EXISTS "Anyone can update submissions" ON public.code_submissions;
DROP POLICY IF EXISTS "Anyone can read shared snippets" ON public.shared_snippets;
DROP POLICY IF EXISTS "Anyone can create shared snippets" ON public.shared_snippets;

-- 2. CREATE TABLES
create table if not exists public.user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  problem_id integer not null,
  language text not null,
  solved_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, problem_id)
);

create table if not exists public.code_submissions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  problem_id text not null,
  language text not null,
  code text not null,
  status text default 'pending' check (status in ('pending', 'verified', 'rejected')),
  submitted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  admin_feedback text,
  reviewed_at timestamp with time zone
);

create table if not exists public.shared_snippets (
  id uuid default gen_random_uuid() primary key,
  code text not null,
  lang text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. ENABLE RLS
alter table public.user_progress enable row level security;
alter table public.code_submissions enable row level security;
alter table public.shared_snippets enable row level security;

-- 4. APPLY GLOBAL POLICIES (Easy Access for Prototype Setup)
create policy "Anyone can view progress" on public.user_progress for select using ( true );
create policy "Anyone can insert progress" on public.user_progress for insert with check ( true );

create policy "Anyone can view submissions" on public.code_submissions for select using ( true );
create policy "Anyone can insert submissions" on public.code_submissions for insert with check ( true ); 
create policy "Anyone can update submissions" on public.code_submissions for update using ( true );

create policy "Anyone can read shared snippets" on public.shared_snippets for select using ( true );
create policy "Anyone can create shared snippets" on public.shared_snippets for insert with check ( true );

-- 5. ENABLE REALTIME (Crucial for Admin Dashboard live updates)
-- Run this to make sure your dashboard updates instantly when code is submitted!
alter publication supabase_realtime add table public.code_submissions;
alter publication supabase_realtime add table public.user_progress;
