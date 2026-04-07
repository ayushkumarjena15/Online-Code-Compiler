-- Run this in your Supabase SQL Editor to set up the backend tables for progress tracking!

-- 1. Create the user_progress table
create table if not exists public.user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  problem_id integer not null,
  language text not null,
  solved_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, problem_id)
);

-- 2. Enable Row Level Security (RLS)
alter table public.user_progress enable row level security;

-- 3. Setup access policies so users can only see and manage their own progress
create policy "Users can view own progress" 
  on public.user_progress for select 
  using ( auth.uid() = user_id );

create policy "Users can insert own progress" 
  on public.user_progress for insert 
  with check ( auth.uid() = user_id );

create policy "Users can update own progress" 
  on public.user_progress for update 
  using ( auth.uid() = user_id );

create policy "Users can delete own progress" 
  on public.user_progress for delete 
  using ( auth.uid() = user_id );
