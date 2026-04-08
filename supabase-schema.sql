-- ==========================================
-- ONLINE CODE COMPILER SUPABASE SCHEMA (v5 - With Profiles & Triggers)
-- ==========================================

-- 1. DROP EXISTING POLICIES (To avoid "Already Exists" error)
DROP POLICY IF EXISTS "Anyone can view progress" ON public.user_progress;
DROP POLICY IF EXISTS "Anyone can view submissions" ON public.code_submissions;
DROP POLICY IF EXISTS "Users can insert own submissions" ON public.code_submissions;
DROP POLICY IF EXISTS "Anyone can update submissions" ON public.code_submissions;
DROP POLICY IF EXISTS "Anyone can read shared snippets" ON public.shared_snippets;
DROP POLICY IF EXISTS "Anyone can create shared snippets" ON public.shared_snippets;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- 2. CREATE TABLES
create table if not exists public.user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  problem_id text not null,
  language text not null,
  solved_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, problem_id)
);

create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  role text default 'student',
  updated_at timestamp with time zone default now()
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
alter table public.profiles enable row level security;

-- 4. APPLY GLOBAL POLICIES (Easy Access for Prototype Setup)
create policy "Anyone can view progress" on public.user_progress for select using ( true );
create policy "Anyone can insert progress" on public.user_progress for insert with check ( true );

create policy "Anyone can view submissions" on public.code_submissions for select using ( true );
create policy "Anyone can insert submissions" on public.code_submissions for insert with check ( true ); 
create policy "Anyone can update submissions" on public.code_submissions for update using ( true );

create policy "Anyone can read shared snippets" on public.shared_snippets for select using ( true );
create policy "Anyone can create shared snippets" on public.shared_snippets for insert with check ( true );

create policy "Public profiles are viewable by everyone" on public.profiles for select using ( true );
create policy "Users can update own profile" on public.profiles for update using ( auth.uid() = id );

-- 5. ENABLE REALTIME
-- Clear old publication if exists to avoid errors
drop publication if exists supabase_realtime;
create publication supabase_realtime for table public.code_submissions, public.user_progress, public.profiles;

-- 6. AUTOMATIC PROFILE CREATION TRIGGER
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to run the function on every signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
