-- ==========================================
-- ONLINE CODE COMPILER SUPABASE SCHEMA (v6 - Defensive & Self-Healing)
-- ==========================================

-- 1. Create the Profiles table first to avoid "not found" errors later
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  role text default 'student',
  updated_at timestamp with time zone default now()
);

-- 2. Create other tables
create table if not exists public.user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  problem_id text not null,
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
  reviewed_at timestamp with time zone,
  contest_id uuid references public.contests
);

create table if not exists public.shared_snippets (
  id uuid default gen_random_uuid() primary key,
  code text not null,
  lang text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.contests (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  created_at timestamp with time zone default now(),
  created_by uuid references auth.users
);

create table if not exists public.contest_problems (
  id uuid default gen_random_uuid() primary key,
  contest_id uuid references public.contests on delete cascade,
  problem_id text not null
);

create table if not exists public.contest_participants (
  id uuid default gen_random_uuid() primary key,
  contest_id uuid references public.contests on delete cascade,
  user_id uuid references auth.users,
  joined_at timestamp with time zone default now(),
  unique(contest_id, user_id)
);

-- 3. Sync existing users (Crucial for existing accounts to show up)
insert into public.profiles (id, email)
select id, email from auth.users
on conflict (id) do nothing;

-- 4. Enable RLS and Policies
alter table public.profiles enable row level security;
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
create policy "Public profiles are viewable by everyone" on public.profiles for select using ( true );
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update using ( auth.uid() = id );

alter table public.code_submissions enable row level security;
drop policy if exists "Anyone can view submissions" on public.code_submissions;
create policy "Anyone can view submissions" on public.code_submissions for select using ( true );
drop policy if exists "Anyone can insert submissions" on public.code_submissions;
create policy "Anyone can insert submissions" on public.code_submissions for insert with check ( true ); 
drop policy if exists "Anyone can update submissions" on public.code_submissions;
create policy "Anyone can update submissions" on public.code_submissions for update using ( true );

alter table public.user_progress enable row level security;
drop policy if exists "Anyone can view progress" on public.user_progress;
create policy "Anyone can view progress" on public.user_progress for select using ( true );
drop policy if exists "Anyone can insert progress" on public.user_progress;
create policy "Anyone can insert progress" on public.user_progress for insert with check ( true );

alter table public.shared_snippets enable row level security;
drop policy if exists "Anyone can read shared snippets" on public.shared_snippets;
create policy "Anyone can read shared snippets" on public.shared_snippets for select using ( true );
drop policy if exists "Anyone can create shared snippets" on public.shared_snippets;
create policy "Anyone can create shared snippets" on public.shared_snippets for insert with check ( true );

alter table public.contests enable row level security;
drop policy if exists "Anyone can view contests" on public.contests;
create policy "Anyone can view contests" on public.contests for select using ( true );
drop policy if exists "Admins can manage contests" on public.contests;
create policy "Admins can manage contests" on public.contests for all using ( true ); -- Simplification for now, should check role in profiles

alter table public.contest_problems enable row level security;
drop policy if exists "Anyone can view contest problems" on public.contest_problems;
create policy "Anyone can view contest problems" on public.contest_problems for select using ( true );
drop policy if exists "Admins can manage contest problems" on public.contest_problems;
create policy "Admins can manage contest problems" on public.contest_problems for all using ( true );

alter table public.contest_participants enable row level security;
drop policy if exists "Anyone can view contest participants" on public.contest_participants;
create policy "Anyone can view contest participants" on public.contest_participants for select using ( true );
drop policy if exists "Users can join contests" on public.contest_participants;
create policy "Users can join contests" on public.contest_participants for insert with check ( true );

-- 5. Enable Realtime
drop publication if exists supabase_realtime;
create publication supabase_realtime for table public.code_submissions, public.profiles, public.user_progress, public.contests;

-- 6. Automatic Profile Trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
