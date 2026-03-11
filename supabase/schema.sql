-- NanoGPT Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  uid text unique not null,
  referral_code text unique not null,
  referred_by uuid references public.profiles(id) on delete set null,
  level int not null default 0,
  avatar_url text,
  language text default 'EN',
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- ============================================================
-- ASSETS
-- ============================================================
create table public.assets (
  user_id uuid references public.profiles(id) on delete cascade primary key,
  task_balance decimal(18,3) default 0,
  vault_balance decimal(18,2) default 0,
  withdrawal_balance decimal(18,3) default 0,
  daily_yield decimal(18,3) default 0,
  total_yield decimal(18,3) default 0,
  updated_at timestamptz default now()
);

alter table public.assets enable row level security;

create policy "Users can manage own assets"
  on public.assets for all using (auth.uid() = user_id);

-- ============================================================
-- DEVICES
-- ============================================================
create table public.devices (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  device_id text unique not null,
  model text default 'iPhone',
  platform text default 'general node power center',
  os text default 'NanoGPT OS',
  ip text,
  created_at timestamptz default now()
);

alter table public.devices enable row level security;

create policy "Users can manage own devices"
  on public.devices for all using (auth.uid() = user_id);

-- ============================================================
-- ORDERS (Tasks)
-- ============================================================
create table public.orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  task_type text not null check (task_type in ('text', 'tabular', 'picture', 'video')),
  investment_amount decimal(18,2) not null,
  return_rate decimal(5,2) not null,
  status text default 'pending' check (status in ('pending', 'active', 'completed', 'failed')),
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz default now()
);

alter table public.orders enable row level security;

create policy "Users can manage own orders"
  on public.orders for all using (auth.uid() = user_id);

-- ============================================================
-- TRANSACTIONS
-- ============================================================
create table public.transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  type text not null check (type in ('deposit', 'withdrawal', 'yield', 'task_profit', 'team_reward')),
  amount decimal(18,3) not null,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  note text,
  created_at timestamptz default now()
);

alter table public.transactions enable row level security;

create policy "Users can view own transactions"
  on public.transactions for select using (auth.uid() = user_id);

create policy "Users can insert own transactions"
  on public.transactions for insert with check (auth.uid() = user_id);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
create table public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  type text not null check (type in ('update', 'service', 'announcement')),
  title text not null,
  content text,
  read boolean default false,
  created_at timestamptz default now()
);

alter table public.notifications enable row level security;

create policy "Users can view own and global notifications"
  on public.notifications for select
  using (auth.uid() = user_id or user_id is null);

create policy "Users can mark own notifications as read"
  on public.notifications for update
  using (auth.uid() = user_id);

-- ============================================================
-- KYC
-- ============================================================
create table public.kyc (
  user_id uuid references public.profiles(id) on delete cascade primary key,
  status text default 'unverified' check (status in ('unverified', 'pending', 'verified', 'rejected')),
  full_name text,
  document_type text check (document_type in ('passport', 'id_card', 'drivers_license')),
  document_number text,
  submitted_at timestamptz,
  updated_at timestamptz default now()
);

alter table public.kyc enable row level security;

create policy "Users can manage own KYC"
  on public.kyc for all using (auth.uid() = user_id);

-- ============================================================
-- REFERRALS
-- ============================================================
create table public.referrals (
  id uuid primary key default uuid_generate_v4(),
  referrer_id uuid references public.profiles(id) on delete cascade,
  referred_id uuid references public.profiles(id) on delete cascade,
  tier int not null check (tier in (1, 2, 3)),
  created_at timestamptz default now(),
  unique(referrer_id, referred_id)
);

alter table public.referrals enable row level security;

create policy "Users can view own referrals"
  on public.referrals for select using (auth.uid() = referrer_id);

-- ============================================================
-- SEED: Default global announcements
-- ============================================================
insert into public.notifications (user_id, type, title, content) values
  (null, 'announcement', '🎉 Welcome to NanoGPT — The Future of Decentralized AI Computing', 'Join millions of users contributing idle compute and earning USDT daily.'),
  (null, 'announcement', '🚀 New Task Types Available', 'Picture and Video tasks now offer up to 150% total return for LV.5+ users.'),
  (null, 'update', 'Platform Update v2.1', 'Improved stability and faster reward processing across all nodes.'),
  (null, 'service', 'Customer Support Now 24/7', 'Our support team is available around the clock to assist you.');
