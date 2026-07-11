-- Supabase SQL Setup
-- Run this in your Supabase SQL Editor

-- 1. Enable required extensions
create extension if not exists "uuid-ossp";

-- 2. Create portfolio table
create table if not exists portfolio (
    id integer primary key default 1,
    data jsonb not null default '{}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    -- Ensure only one row exists
    constraint portfolio_id_check check (id = 1)
);

-- 3. Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Check if trigger exists before creating
do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'handle_portfolio_updated_at') then
    create trigger handle_portfolio_updated_at
        before update on portfolio
        for each row
        execute function handle_updated_at();
  end if;
end
$$;

-- 4. Insert initial data if not exists
insert into portfolio (id, data)
values (1, '{
  "hero": {
    "name": "Geta Tenaw",
    "titles": ["Fullstack Developer", "Cybersecurity Researcher", "Tech Innovator"],
    "description": "Passionate about building secure, scalable web applications and exploring the latest in cybersecurity and AI.",
    "profileImage": ""
  },
  "about": {
    "description": ""
  },
  "skills": [],
  "projects": [
    {
      "id": 1,
      "title": "Portfolio Website",
      "description": "A modern, responsive portfolio website built with React and Supabase.",
      "image": "",
      "tags": ["React", "Supabase", "Tailwind CSS"],
      "category": "frontend",
      "liveUrl": "",
      "githubUrl": ""
    },
    {
      "id": 2,
      "title": "Secure Chat App",
      "description": "End-to-end encrypted chat application with real-time messaging.",
      "image": "",
      "tags": ["React", "Node.js", "Socket.io", "AES-256"],
      "category": "fullstack",
      "liveUrl": "",
      "githubUrl": ""
    },
    {
      "id": 3,
      "title": "E-Commerce Dashboard",
      "description": "Analytics dashboard for e-commerce businesses with real-time data.",
      "image": "",
      "tags": ["React", "Chart.js", "Express", "MongoDB"],
      "category": "fullstack",
      "liveUrl": "",
      "githubUrl": ""
    }
  ],
  "experience": [],
  "contact": {
    "email": "",
    "phone": "",
    "location": "",
    "socialLinks": []
  },
  "admin": {
    "password": "admin123"
  }
}'::jsonb)
on conflict (id) do nothing;

-- 5. Enable Row Level Security (RLS)
alter table portfolio enable row level security;

-- 6. Create RLS policies for portfolio table
create policy "Enable read access for all users"
  on portfolio for select
  using (true);

create policy "Enable update access for authenticated users only"
  on portfolio for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Note: For simplicity, we'll allow public access for now (you can restrict later)
create policy "Public can update"
  on portfolio
  for all
  using (true);

-- 7. Create Storage bucket for images
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-images', 'portfolio-images', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
on conflict (id) do update set public = true;

-- 8. Storage RLS policies for buckets (allow listing)
create policy "Public can list buckets"
  on storage.buckets for select
  using (true);

-- 9. Storage RLS policies for objects
create policy "Public Access"
  on storage.objects for select
  using (bucket_id = 'portfolio-images');

create policy "Public can upload"
  on storage.objects for insert
  with check (bucket_id = 'portfolio-images');

create policy "Public can update"
  on storage.objects for update
  using (bucket_id = 'portfolio-images');

create policy "Public can delete"
  on storage.objects for delete
  using (bucket_id = 'portfolio-images');
