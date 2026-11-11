-- ZP Primary School Shilshet Management Portal Schema
-- Execute in Supabase SQL Editor

-- 1. Students Table
create table if not exists public.students (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    class_standard int not null check (class_standard between 1 and 5),
    full_name text not null,
    mother_name text not null,
    register_number varchar(10) not null,
    aadhaar_number varchar(12) not null,
    pen_id varchar(11) not null,
    mobile_number varchar(10) not null,
    bank_name text,
    bank_account_no text,
    bank_ifsc text,
    caste_category text not null,
    study_iq_score int default 50 check (study_iq_score between 0 and 100),
    photo_url text
);

-- 2. Assignments & Media Dispatch Table
create table if not exists public.assignments (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    target_class int check (target_class between 1 and 5), -- null implies all classes
    title text not null,
    content_text text,
    media_type text check (media_type in ('text', 'image', 'document', 'youtube', 'url')),
    media_url text,
    faculty_id uuid references auth.users(id)
);

-- 3. Inquiries Table
create table if not exists public.inquiries (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    student_name text not null,
    parent_name text not null,
    contact_number varchar(10) not null,
    applying_for_class int check (applying_for_class between 1 and 5),
    message text,
    status text default 'pending'
);

-- Row Level Security (RLS)
alter table public.students enable row level security;
alter table public.assignments enable row level security;
alter table public.inquiries enable row level security;

-- Faculty Access Policy
create policy "Authenticated faculty can read/write students"
on public.students for all to authenticated using (true) with check (true);

create policy "Authenticated faculty can read/write assignments"
on public.assignments for all to authenticated using (true) with check (true);

create policy "Public can read assignments"
on public.assignments for select to anon using (true);

create policy "Public can insert inquiries"
on public.inquiries for insert to anon with check (true);

create policy "Authenticated faculty can view and update inquiries"
on public.inquiries for all to authenticated using (true) with check (true);

-- Storage Buckets Configuration
-- Note: Create buckets 'student-photos' and 'assignment-files' in Supabase Storage.
insert into storage.buckets (id, name, public) 
values 
  ('student-photos', 'student-photos', true),
  ('assignment-files', 'assignment-files', true)
on conflict (id) do nothing;

-- Storage Policies
create policy "Public Access to Student Photos"
on storage.objects for select
using (bucket_id = 'student-photos');

create policy "Faculty Upload Student Photos"
on storage.objects for insert
to authenticated
with check (bucket_id = 'student-photos');

create policy "Public Access to Assignment Files"
on storage.objects for select
using (bucket_id = 'assignment-files');

create policy "Faculty Upload Assignment Files"
on storage.objects for insert
to authenticated
with check (bucket_id = 'assignment-files');

