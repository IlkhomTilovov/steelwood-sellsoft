-- ============================================================================
-- Instagram videos — homepage "Interyer uchun ilhom" section
--
-- `instagram_url` is the pasted Instagram post/reel link — the frontend
-- renders it with Instagram's own official embed widget (embed.js), so the
-- video plays right on the page with no backend involved.
-- `video_url` is an optional manual override: a direct .mp4 link (or an
-- uploaded file) played with a plain <video> tag instead of the Instagram
-- embed, for when a post can't be embedded (private post, etc.).
--
-- NOTE: this project has no automated migration pipeline (see the note at
-- the top of 20260831000000_reconstructed_schema.sql) — paste this file's
-- contents into the Supabase project's SQL Editor and run it once.
-- This file is idempotent (safe to re-run) in case an earlier partial run
-- already created the table and/or some of the policies.
-- ============================================================================

create table if not exists public.instagram_videos (
  id uuid primary key default gen_random_uuid()
);

-- `create table if not exists` above is a no-op when the table already
-- exists (e.g. created earlier by hand, or by a prior partial run with a
-- different column set) — so every column is (re-)ensured explicitly here
-- rather than trusted to the table definition.
--
-- A leftover `url` column (not-null, from an earlier ad-hoc version of this
-- table) is dropped here — nothing in the app reads or writes it, and its
-- not-null constraint blocks every insert done through the current columns.
alter table public.instagram_videos drop column if exists url;
alter table public.instagram_videos add column if not exists instagram_url text;
alter table public.instagram_videos add column if not exists video_url text;
alter table public.instagram_videos add column if not exists caption_uz text;
alter table public.instagram_videos add column if not exists caption_ru text;
alter table public.instagram_videos add column if not exists is_active boolean not null default true;
alter table public.instagram_videos add column if not exists sort_order integer not null default 0;
alter table public.instagram_videos add column if not exists created_at timestamptz not null default now();
alter table public.instagram_videos add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'instagram_videos_has_source'
      and conrelid = 'public.instagram_videos'::regclass
  ) then
    alter table public.instagram_videos
      add constraint instagram_videos_has_source
      check (instagram_url is not null or video_url is not null);
  end if;
end $$;

alter table public.instagram_videos enable row level security;

-- Public (anon) visitors can read only the active rows shown on the site.
drop policy if exists "Public can view active instagram videos" on public.instagram_videos;
create policy "Public can view active instagram videos"
  on public.instagram_videos for select
  using (is_active = true);

-- Admins/managers can read every row (including inactive ones) in the admin
-- panel — matches the "siteContent" permission module (admin + manager) that
-- gates this page on the frontend (see src/lib/permissions.ts).
drop policy if exists "Staff can view all instagram videos" on public.instagram_videos;
create policy "Staff can view all instagram videos"
  on public.instagram_videos for select
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'manager'));

drop policy if exists "Staff can insert instagram videos" on public.instagram_videos;
create policy "Staff can insert instagram videos"
  on public.instagram_videos for insert
  with check (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'manager'));

drop policy if exists "Staff can update instagram videos" on public.instagram_videos;
create policy "Staff can update instagram videos"
  on public.instagram_videos for update
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'manager'));

drop policy if exists "Staff can delete instagram videos" on public.instagram_videos;
create policy "Staff can delete instagram videos"
  on public.instagram_videos for delete
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'manager'));
