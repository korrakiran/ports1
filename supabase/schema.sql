# Supabase Database Schema for MSME Global Trade Marketplace

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles & MSME Companies Table
create table if not exists public.msme_profiles (
  id uuid primary key default uuid_generate_v4(),
  company_name text not null,
  contact_name text,
  country text default 'India',
  country_flag text default '🇮🇳',
  iec_number text,
  verification_status text default 'Gold Verified MSME',
  credit_score integer default 780,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Trade Opportunities Table
create table if not exists public.trade_opportunities (
  id uuid primary key default uuid_generate_v4(),
  opp_code text unique not null,
  title text not null,
  hs_code text not null,
  category text not null,
  destination country text not null,
  flag text default '🌐',
  importer_name text not null,
  is_verified boolean default true,
  volume_required text not null,
  target_price text not null,
  estimated_margin text not null,
  opportunity_score integer default 90,
  matching_rate text default '95%',
  deadline text default 'In 7 days',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Transactions / Order Pipeline Table
create table if not exists public.trade_transactions (
  id uuid primary key default uuid_generate_v4(),
  trx_code text unique not null,
  product text not null,
  partner text not null,
  value text not null,
  status text not null,
  step integer default 1,
  total_steps integer default 5,
  eta text,
  payment_status text,
  hs_code text,
  carrier text,
  docs_ready integer default 2,
  docs_total integer default 5,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Security Policies
alter table public.msme_profiles enable row level security;
alter table public.trade_opportunities enable row level security;
alter table public.trade_transactions enable row level security;

create policy "Public read access for opportunities" on public.trade_opportunities for select using (true);
create policy "Public read access for transactions" on public.trade_transactions for select using (true);
