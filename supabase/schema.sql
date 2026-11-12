-- ==============================================================================
-- ZP Primary School Shilshet (जि.प. प्राथमिक शाळा शिलशेत)
-- Taluka Mokhada, District Palghar • U-DISE Code: 27361809501
-- Complete Cloud Database Schema for Supabase (Execute in Supabase SQL Editor)
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. STUDENTS TABLE
create table if not exists public.students (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    class_standard int not null check (class_standard between 1 and 5),
    full_name text not null,
    mother_name text not null,
    register_number varchar(10) not null unique,
    aadhaar_number varchar(12) not null,
    pen_id varchar(11) not null,
    mobile_number varchar(10) not null,
    bank_name text,
    bank_account_no text,
    bank_ifsc text,
    caste_category text not null,
    study_iq_score int default 50 check (study_iq_score between 0 and 100),
    photo_url text,
    report_card jsonb
);

-- 2. ASSIGNMENTS & HOMEWORK TABLE
create table if not exists public.assignments (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    target_class int check (target_class between 1 and 5), -- null implies All Classes
    title text not null,
    content_text text,
    media_type text check (media_type in ('text', 'image', 'document', 'youtube', 'url', 'audio')),
    media_url text,
    audio_url text,
    faculty_id uuid references auth.users(id),
    author_name text default 'श्री. अकबर पटेल (शिक्
    षक)'
);

-- 3. DIGITAL NOTICE BOARD TABLE
create table if not exists public.notices (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    title text not null,
    title_mr text not null,
    content text not null,
    content_mr text,
    category text not null check (category in ('urgent', 'holiday', 'exam', 'event', 'general')),
    media_type text not null check (media_type in ('text', 'image', 'flyer', 'gif', 'video', 'audio')),
    media_url text,
    audio_url text,
    is_pinned boolean default false,
    author_name text default 'श्री. अकबर पटेल (शिक्षक)'
);

-- 4. DAILY ATTENDANCE & PM-POSHAN (MDM) TABLE
create table if not exists public.attendance_records (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    date date not null,
    student_id uuid references public.students(id) on delete cascade,
    register_number varchar(10) not null,
    student_name text not null,
    class_standard int not null,
    status text not null check (status in ('present', 'absent')),
    meal_opt_out boolean default false,
    unique(date, student_id)
);

-- 5. ADMISSION INQUIRIES TABLE
create table if not exists public.inquiries (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    student_name text not null,
    parent_name text not null,
    contact_number varchar(10) not null,
    applying_for_class int check (applying_for_class between 1 and 5),
    message text,
    status text default 'pending' check (status in ('pending', 'contacted', 'enrolled', 'rejected'))
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Allow full access to school portal tables
alter table public.students disable row level security;
alter table public.assignments disable row level security;
alter table public.notices disable row level security;
alter table public.attendance_records disable row level security;
alter table public.inquiries disable row level security;

-- ==============================================================================
-- STORAGE BUCKETS (FOR PHOTOS, HOMEWORK, AND FLYERS)
-- ==============================================================================

insert into storage.buckets (id, name, public) 
values 
  ('student-photos', 'student-photos', true),
  ('assignment-files', 'assignment-files', true),
  ('notice-media', 'notice-media', true)
on conflict (id) do nothing;

drop policy if exists "Public Access to Student Photos" on storage.objects;
create policy "Public Access to Student Photos" on storage.objects for select using (bucket_id = 'student-photos');

drop policy if exists "Allow uploads to student-photos" on storage.objects;
create policy "Allow uploads to student-photos" on storage.objects for insert to anon, authenticated with check (bucket_id = 'student-photos');

drop policy if exists "Public Access to Assignment Files" on storage.objects;
create policy "Public Access to Assignment Files" on storage.objects for select using (bucket_id = 'assignment-files');

drop policy if exists "Allow uploads to assignment-files" on storage.objects;
create policy "Allow uploads to assignment-files" on storage.objects for insert to anon, authenticated with check (bucket_id = 'assignment-files');

drop policy if exists "Public Access to Notice Media" on storage.objects;
create policy "Public Access to Notice Media" on storage.objects for select using (bucket_id = 'notice-media');

drop policy if exists "Allow uploads to notice-media" on storage.objects;
create policy "Allow uploads to notice-media" on storage.objects for insert to anon, authenticated with check (bucket_id = 'notice-media');
with check (bucket_id = 'notice-media');
