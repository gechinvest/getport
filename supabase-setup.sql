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

create trigger if not exists handle_portfolio_updated_at
    before update on portfolio
    for each row
    execute function handle_updated_at();

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

-- 6. Create RLS policies
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

-- 8. Storage RLS policies
create policy "Public Access"
  on storage.objects for select
  using (bucket_id = 'portfolio-images');

create policy "Authenticated Upload"
  on storage.objects for insert
  with check (bucket_id = 'portfolio-images');

create policy "Authenticated Update"
  on storage.objects for update
  using (bucket_id = 'portfolio-images');

create policy "Authenticated Delete"
  on storage.objects for delete
  using (bucket_id = 'portfolio-images');

-- Note: For simplicity, let's also allow public uploads for now (remove later if needed)
drop policy if exists "Authenticated Upload" on storage.objects;
drop policy if exists "Authenticated Update" on storage.objects;
drop policy if exists "Authenticated Delete" on storage.objects;

create policy "Public can upload"
  on storage.objects for insert
  with check (bucket_id = 'portfolio-images');

create policy "Public can update"
  on storage.objects for update
  using (bucket_id = 'portfolio-images');

create policy "Public can delete"
  on storage.objects for delete
  using (bucket_id = 'portfolio-images');
