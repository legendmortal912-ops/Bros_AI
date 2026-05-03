-- Bros_AI Supabase Schema
-- Run this in your Supabase SQL Editor

-- Task history
create table if not exists public.task_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  instruction text not null,
  status text not null default 'pending' check (status in ('pending', 'running', 'completed', 'failed')),
  steps text[] default '{}',
  tools_used text[] default '{}',
  result text,
  duration_seconds integer,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- User integrations
create table if not exists public.user_integrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  provider text not null,
  access_token text,
  refresh_token text,
  expires_at timestamptz,
  connected boolean default true,
  created_at timestamptz default now(),
  unique(user_id, provider)
);

-- RLS policies
alter table public.task_history enable row level security;
alter table public.user_integrations enable row level security;

create policy "Users can manage their own task history"
  on public.task_history for all
  using (auth.uid() = user_id);

create policy "Users can manage their own integrations"
  on public.user_integrations for all
  using (auth.uid() = user_id);

-- Updated at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
  before update on public.task_history
  for each row execute function update_updated_at();
