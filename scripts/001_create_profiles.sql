-- Create user roles enum type
create type public.user_role as enum ('guest', 'owner', 'admin');

-- Create profiles table that references auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role public.user_role not null default 'guest',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- RLS Policies for profiles table
-- Users can read their own profile
create policy "profiles_select_own" on public.profiles 
  for select using (auth.uid() = id);

-- Users can insert their own profile
create policy "profiles_insert_own" on public.profiles 
  for insert with check (auth.uid() = id);

-- Users can update their own profile
create policy "profiles_update_own" on public.profiles 
  for update using (auth.uid() = id);

-- Users can delete their own profile
create policy "profiles_delete_own" on public.profiles 
  for delete using (auth.uid() = id);

-- Create index for faster role lookups
create index if not exists profiles_role_idx on public.profiles(role);
