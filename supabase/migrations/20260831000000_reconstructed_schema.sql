-- ============================================================================
-- SteelWood — reconstructed schema (best-effort)
--
-- WHY THIS FILE EXISTS: the original Lovable Cloud project ran out of
-- credits and its live database became hard to reach for the public API.
-- No SQL migrations were ever checked into this repo, so this file was
-- reverse-engineered from src/integrations/supabase/types.ts (the
-- auto-generated TypeScript types), which records every table/column/type
-- but NOT: exact defaults for some columns, RLS policies, storage buckets,
-- or the SQL body of the `amocrm_test_lead` function. Read the checklist
-- at the bottom before treating the new project as production-ready.
--
-- HOW TO USE: paste this whole file into the NEW Supabase project's
-- SQL Editor and run it once. It creates all 19 tables, the app_role enum,
-- foreign keys, and the has_role() helper function.
-- ============================================================================

create extension if not exists pgcrypto;

-- ---------- Enum ----------
create type public.app_role as enum ('admin', 'editor', 'seller', 'manager');

-- ---------- Tables (no FKs yet — added at the bottom, after all tables exist) ----------

create table public.branches (
  id uuid primary key default gen_random_uuid(),
  address_uz text not null,
  address_ru text not null default '',
  latitude double precision not null,
  longitude double precision not null,
  name_uz text not null,
  name_ru text not null default '',
  order_index integer not null default 0,
  phone text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.sections (
  id uuid primary key default gen_random_uuid(),
  name_uz text not null,
  name_ru text not null,
  slug text not null unique,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name_uz text not null,
  name_ru text not null,
  slug text not null unique,
  parent_id uuid,
  section_id uuid,
  icon text,
  image text,
  amocrm_category text,
  is_active boolean default true,
  is_followed boolean default true,
  is_indexed boolean default true,
  show_in_banner boolean not null default false,
  sort_order integer default 0,
  meta_title_uz text,
  meta_title_ru text,
  meta_description_uz text,
  meta_description_ru text,
  meta_keywords text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.checkout_fields (
  id uuid primary key default gen_random_uuid(),
  label_uz text not null,
  label_ru text not null,
  field_type text not null default 'text',
  icon text,
  is_required boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.checkout_field_options (
  id uuid primary key default gen_random_uuid(),
  field_id uuid not null,
  label_uz text not null,
  label_ru text not null,
  value text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  phone text not null unique,
  name text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.hero_slides (
  id uuid primary key default gen_random_uuid(),
  title_uz text not null default '',
  title_ru text not null default '',
  subtitle_uz text not null default '',
  subtitle_ru text not null default '',
  cta_text_uz text not null default '',
  cta_text_ru text not null default '',
  cta_link text not null default '',
  image text,
  mobile_image text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name_uz text not null,
  name_ru text not null,
  slug text unique,
  description_uz text,
  description_ru text,
  full_description_uz text,
  full_description_ru text,
  category_id uuid,
  price numeric,
  original_price numeric,
  is_negotiable boolean default false,
  images text[],
  colors text[],
  colors_ru text[] not null default '{}',
  materials text[],
  materials_ru text[] not null default '{}',
  sizes text[],
  sizes_ru text[] not null default '{}',
  application text[],
  fur_length text[],
  variants_uz text[],
  variants_ru text[],
  attributes jsonb not null default '{}'::jsonb,
  in_stock boolean default true,
  is_active boolean default true,
  is_featured boolean default false,
  sort_order integer default 0,
  promo_tile_ids uuid[] not null default '{}',
  show_in_hero boolean not null default false,
  hero_priority integer not null default 0,
  hero_title_uz text,
  hero_title_ru text,
  hero_subtitle_uz text,
  hero_subtitle_ru text,
  show_in_discount_banner boolean not null default false,
  is_followed boolean default true,
  is_indexed boolean default true,
  meta_title_uz text,
  meta_title_ru text,
  meta_description_uz text,
  meta_description_ru text,
  meta_keywords text,
  target_keyword text,
  keyword_uz text,
  keyword_ru text,
  keyword_variations text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_id uuid,
  customer_name text not null,
  customer_phone text not null,
  customer_message text,
  status text not null default 'new',
  total_price numeric,
  created_by_user_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null,
  product_id uuid not null,
  product_name_snapshot text not null,
  price_snapshot numeric,
  quantity integer not null default 1,
  selected_options jsonb,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  email text not null,
  name text not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

create table public.promo_tiles (
  id uuid primary key default gen_random_uuid(),
  title_uz text not null,
  title_ru text not null,
  icon text not null default '',
  href text not null default '',
  bg_class text not null default '',
  text_class text not null default '',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.sets (
  id uuid primary key default gen_random_uuid(),
  title_uz text not null,
  title_ru text not null,
  image text,
  href text,
  product_ids uuid[] not null default '{}',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.site_content (
  id uuid primary key default gen_random_uuid(),
  key text not null,
  page text,
  section text,
  content_type text,
  value_uz text,
  value_ru text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.system_settings (
  id uuid primary key default gen_random_uuid(),
  site_name text,
  primary_domain text,
  logo_url text,
  favicon_url text,
  default_language text default 'uz',
  languages_enabled text[] default array['uz','ru'],
  seo_title text,
  seo_description text,
  contact_phone text,
  whatsapp_number text,
  address_uz text,
  address_ru text,
  working_hours_uz text,
  working_hours_ru text,
  short_description_uz text,
  short_description_ru text,
  social_facebook text,
  social_instagram text,
  social_telegram text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.themes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  is_active boolean not null default false,
  is_dark boolean not null default false,
  color_palette jsonb not null default '{}'::jsonb,
  typography jsonb not null default '{}'::jsonb,
  layout_settings jsonb not null default '{}'::jsonb,
  component_styles jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- Foreign keys (added after every table exists) ----------

alter table public.categories
  add constraint categories_parent_id_fkey foreign key (parent_id) references public.categories(id),
  add constraint categories_section_id_fkey foreign key (section_id) references public.sections(id);

alter table public.checkout_field_options
  add constraint checkout_field_options_field_id_fkey foreign key (field_id) references public.checkout_fields(id) on delete cascade;

alter table public.products
  add constraint products_category_id_fkey foreign key (category_id) references public.categories(id);

alter table public.orders
  add constraint orders_customer_id_fkey foreign key (customer_id) references public.customers(id);

alter table public.order_items
  add constraint order_items_order_id_fkey foreign key (order_id) references public.orders(id) on delete cascade,
  add constraint order_items_product_id_fkey foreign key (product_id) references public.products(id);

alter table public.profiles
  add constraint profiles_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;

alter table public.user_roles
  add constraint user_roles_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;

-- ---------- Helper function used by RLS policies ----------
-- Standard Supabase pattern: checks whether a user has a given role.
-- (Reconstructed from the function's Args/Returns signature — verify
-- against the old project's actual definition if you can still reach it:
-- select prosrc from pg_proc where proname = 'has_role';)

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- `amocrm_test_lead()` also existed in the old project (returns jsonb) but
-- its SQL body isn't recoverable from types.ts. If you can still open the
-- old project's SQL Editor, run:
--   select prosrc from pg_proc where proname = 'amocrm_test_lead';
-- and paste the result here before relying on it.

-- ============================================================================
-- STILL TO DO (not covered by this script):
-- 1. Row Level Security — for every table above, run in the OLD project:
--      select schemaname, tablename, policyname, cmd, qual, with_check
--      from pg_policies where schemaname = 'public';
--    then recreate each `create policy ...` statement here, and
--    `alter table <t> enable row level security;` per table.
-- 2. Storage buckets — recreate `product-images` and `sitemap` buckets
--    under Cloud → Storage in the new project, then re-upload files.
-- 3. Edge functions — redeploy supabase/functions/* to the new project
--    via the Supabase CLI: `supabase functions deploy <name>`.
-- 4. Secrets — re-enter every API key/secret used by those functions under
--    Cloud → Secrets in the new project.
-- 5. Data — export rows from the old project (Table Editor → Export CSV
--    per table is simplest; for array/jsonb columns like products.images,
--    verify the CSV round-trips correctly, or generate INSERT statements
--    manually instead) and import them here after this schema is applied.
-- ============================================================================
