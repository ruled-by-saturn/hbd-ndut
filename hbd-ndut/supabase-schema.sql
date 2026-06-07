-- Run this in your Supabase SQL Editor to set up the database

-- 1. Create the wishes table
create table if not exists wishes (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  message     text not null,
  memory      text,
  photo_urls  text[] default '{}',
  shape       text not null default 'circle',
  color       text not null default '#FFB3C6',
  pos_x       float not null default 50,
  pos_y       float not null default 50,
  created_at  timestamptz default now()
);

-- 2. Enable Row Level Security
alter table wishes enable row level security;

-- 3. Allow anyone to read wishes (public board)
create policy "Anyone can read wishes"
  on wishes for select
  using (true);

-- 4. Allow anyone to insert wishes (open form)
create policy "Anyone can insert wishes"
  on wishes for insert
  with check (true);

-- 5. Create storage bucket for photos
insert into storage.buckets (id, name, public)
values ('wish-photos', 'wish-photos', true)
on conflict do nothing;

-- 6. Allow anyone to upload to the bucket
create policy "Anyone can upload photos"
  on storage.objects for insert
  with check (bucket_id = 'wish-photos');

-- 7. Allow public read of photos
create policy "Anyone can view photos"
  on storage.objects for select
  using (bucket_id = 'wish-photos');
