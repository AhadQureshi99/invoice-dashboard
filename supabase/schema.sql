-- =========================================================================
-- Invoice Dashboard — Supabase schema (FULL)
-- Run once in the Supabase SQL editor.
-- =========================================================================

-- ── Extensions ────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp" with schema extensions;
create extension if not exists pgcrypto    with schema extensions;

-- ── Profiles ──────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id              uuid        primary key references auth.users(id) on delete cascade,
  email           text        not null,
  entity_name     text,
  id_type         text        default 'NTN',
  credential_no   text,
  role            text        default 'admin' check (role in ('admin','manager','operator','accountant','viewer')),
  avatar_url      text,
  org_id          uuid,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, entity_name, id_type, credential_no, role, org_id)
  values (
    new.id, new.email,
    coalesce(new.raw_user_meta_data->>'entity_name', ''),
    coalesce(new.raw_user_meta_data->>'id_type', 'NTN'),
    coalesce(new.raw_user_meta_data->>'credential_no', ''),
    coalesce(new.raw_user_meta_data->>'role', 'admin'),
    new.id   -- each user owns their own org by default
  )
  on conflict (id) do nothing;

  -- welcome notification
  insert into public.notifications (user_id, title, body, severity, category)
  values (new.id, 'Welcome to FBR Invoice Manager',
          'Your dashboard is ready. Start by verifying or drafting an invoice.',
          'info', 'system');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Invoices ──────────────────────────────────────────────────────────────
create table if not exists public.invoices (
  id                   uuid        primary key default uuid_generate_v4(),
  user_id              uuid        references auth.users(id) on delete set null,
  invoice_number       text        not null,
  invoice_type         text        default 'Sale Invoice',
  invoice_date         date        not null default current_date,
  invoice_ref_no       text,
  scenario_id          text        default 'SN000',
  seller_ntn           text,
  seller_name          text,
  seller_province      text,
  seller_address       text,
  buyer_ntn            text,
  buyer_name           text,
  buyer_province       text,
  buyer_address        text,
  buyer_reg_type       text        default 'Registered',
  subtotal             numeric(18,2) default 0,
  tax_amount           numeric(18,2) default 0,
  total_amount         numeric(18,2) default 0,
  status               text        default 'draft'
    check (status in ('draft','ready','pending','verified','invalid','failed','void')),
  fbr_invoice_no       text,
  fbr_status_code      text,
  fbr_message          text,
  fbr_response         jsonb,
  hash_checksum        text,
  qr_code              text,
  created_at           timestamptz default now(),
  updated_at           timestamptz default now()
);

create index if not exists invoices_user_id_idx        on public.invoices(user_id);
create index if not exists invoices_status_idx         on public.invoices(status);
create index if not exists invoices_invoice_date_idx   on public.invoices(invoice_date desc);
create index if not exists invoices_invoice_number_idx on public.invoices(invoice_number);

-- ── Invoice items ─────────────────────────────────────────────────────────
create table if not exists public.invoice_items (
  id              uuid       primary key default uuid_generate_v4(),
  invoice_id      uuid       not null references public.invoices(id) on delete cascade,
  hs_code         text,
  description     text,
  rate            text       default '0%',
  uom             text,
  quantity        numeric(18,4) default 0,
  total           numeric(18,2) default 0,
  value_excl_st   numeric(18,2) default 0,
  retail_price    numeric(18,2) default 0,
  sales_tax       numeric(18,2) default 0,
  tax_withheld    numeric(18,2) default 0,
  extra_tax       text,
  further_tax     numeric(18,2) default 0,
  sro_schedule    text,
  fed_payable     numeric(18,2) default 0,
  discount        numeric(18,2) default 0,
  sale_type       text,
  sro_serial      text,
  created_at      timestamptz default now()
);
create index if not exists invoice_items_invoice_id_idx on public.invoice_items(invoice_id);

-- ── Drafts ────────────────────────────────────────────────────────────────
-- One row per seller company a user files for, with that company's own FBR
-- token. An FBR token is bound to a single seller NTN, so multi-company
-- support means storing one token per seller (entered from FBR IRIS).
create table if not exists public.sellers (
  id            uuid          primary key default uuid_generate_v4(),
  user_id       uuid          not null references auth.users(id) on delete cascade,
  company_name  text          not null,
  ntn           text          not null,
  fbr_token     text          not null,
  fbr_mode      text          not null default 'production',
  province      text          default '',
  address       text          default '',
  is_default    boolean       not null default false,
  created_at    timestamptz   default now(),
  updated_at    timestamptz   default now()
);
create index if not exists sellers_user_id_idx on public.sellers(user_id);

create table if not exists public.drafts (
  id              uuid        primary key default uuid_generate_v4(),
  user_id         uuid        references auth.users(id) on delete cascade,
  seller_id       uuid        references public.sellers(id) on delete set null,
  invoice_number  text,
  invoice_date    date,
  seller_ntn      text,
  seller_name     text,
  buyer_ntn       text,
  buyer_name      text,
  description     text,
  quantity        numeric(18,4) default 0,
  unit_price      numeric(18,2) default 0,
  subtotal        numeric(18,2) default 0,
  tax_amount      numeric(18,2) default 0,
  total_amount    numeric(18,2) default 0,
  status          text          default 'auto-saved',
  payload         jsonb,
  created_at      timestamptz   default now(),
  updated_at      timestamptz   default now()
);
create index if not exists drafts_user_id_idx on public.drafts(user_id);

-- ── Verifications ─────────────────────────────────────────────────────────
create table if not exists public.verifications (
  id                  uuid        primary key default uuid_generate_v4(),
  user_id             uuid        references auth.users(id) on delete set null,
  invoice_id          uuid        references public.invoices(id) on delete set null,
  invoice_number      text,
  seller_ntn          text,
  buyer_ntn           text,
  invoice_date        date,
  amount              numeric(18,2) default 0,
  status              text        not null default 'pending'
    check (status in ('verified','invalid','pending','duplicate','failed')),
  fbr_invoice_no      text,
  fbr_status_code     text,
  fbr_message         text,
  request_payload     jsonb,
  response_payload    jsonb,
  response_time_ms    int,
  created_at          timestamptz default now()
);
create index if not exists verifications_created_at_idx on public.verifications(created_at desc);
create index if not exists verifications_user_id_idx    on public.verifications(user_id);
create index if not exists verifications_status_idx     on public.verifications(status);

-- ── Notifications ─────────────────────────────────────────────────────────
create table if not exists public.notifications (
  id           uuid        primary key default uuid_generate_v4(),
  user_id      uuid        references auth.users(id) on delete cascade,
  title        text        not null,
  body         text,
  severity     text        default 'info' check (severity in ('info','success','warning','critical')),
  category     text        default 'system' check (category in ('system','batch','security','verification')),
  link         text,
  metadata     jsonb,
  is_read      boolean     default false,
  is_archived  boolean     default false,
  created_at   timestamptz default now()
);
create index if not exists notifications_user_id_idx    on public.notifications(user_id);
create index if not exists notifications_created_at_idx on public.notifications(created_at desc);

-- ── Activity log ──────────────────────────────────────────────────────────
create table if not exists public.activity_log (
  id           uuid        primary key default uuid_generate_v4(),
  user_id      uuid        references auth.users(id) on delete set null,
  action       text        not null,
  subject      text,
  status       text,
  type         text        default 'saved' check (type in ('verified','success','invalid','saved','updated','deleted')),
  metadata     jsonb,
  created_at   timestamptz default now()
);
create index if not exists activity_log_created_at_idx on public.activity_log(created_at desc);
create index if not exists activity_log_user_id_idx    on public.activity_log(user_id);

-- ── Team members (org-level user roster) ─────────────────────────────────
create table if not exists public.team_members (
  id           uuid        primary key default uuid_generate_v4(),
  org_id       uuid        not null,
  invited_by   uuid        references auth.users(id) on delete set null,
  name         text        not null,
  email        text        not null,
  role         text        default 'viewer' check (role in ('admin','accountant','viewer')),
  status       text        default 'pending' check (status in ('active','pending','disabled')),
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);
create index if not exists team_members_org_idx   on public.team_members(org_id);
create index if not exists team_members_email_idx on public.team_members(email);

-- ── User preferences (privacy / 2FA toggles etc) ─────────────────────────
create table if not exists public.user_preferences (
  user_id            uuid        primary key references auth.users(id) on delete cascade,
  two_factor_enabled boolean     default true,
  privacy_guard      boolean     default true,
  email_alerts       boolean     default true,
  push_alerts        boolean     default false,
  language           text        default 'EN',
  auto_purge_days    int         default 365,
  updated_at         timestamptz default now()
);

-- ── Reports / Downloads ──────────────────────────────────────────────────
create table if not exists public.reports (
  id             uuid        primary key default uuid_generate_v4(),
  user_id        uuid        references auth.users(id) on delete cascade,
  name           text        not null,
  kind           text        default 'verification'
    check (kind in ('verification','audit','tax-liability','reconciliation','bulk-export')),
  format         text        default 'csv' check (format in ('csv','zip','pdf','xlsx')),
  date_range     text,
  size_bytes     bigint      default 0,
  progress       int         default 100 check (progress between 0 and 100),
  download_url   text,
  status         text        default 'ready' check (status in ('processing','ready','failed')),
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);
create index if not exists reports_user_id_idx on public.reports(user_id);

-- ── System status (singleton) ─────────────────────────────────────────────
create table if not exists public.system_status (
  id                int         primary key default 1,
  online            boolean     default true,
  archive_used_gb   numeric(8,2) default 0,
  archive_total_gb  numeric(8,2) default 100,
  auto_purge_days   int         default 365,
  last_sync_at      timestamptz default now(),
  updated_at        timestamptz default now(),
  constraint system_status_singleton check (id = 1)
);
insert into public.system_status (id) values (1) on conflict (id) do nothing;

-- ── Sessions log (login history per user) ─────────────────────────────────
create table if not exists public.user_sessions (
  id             uuid        primary key default uuid_generate_v4(),
  user_id        uuid        references auth.users(id) on delete cascade,
  device         text,
  browser        text,
  location       text,
  ip             text,
  is_current     boolean     default false,
  last_active_at timestamptz default now(),
  created_at     timestamptz default now()
);
create index if not exists user_sessions_user_idx on public.user_sessions(user_id);

-- ── updated_at triggers ──────────────────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists profiles_touch       on public.profiles;
create trigger profiles_touch       before update on public.profiles       for each row execute function public.touch_updated_at();
drop trigger if exists invoices_touch       on public.invoices;
create trigger invoices_touch       before update on public.invoices       for each row execute function public.touch_updated_at();
drop trigger if exists drafts_touch         on public.drafts;
create trigger drafts_touch         before update on public.drafts         for each row execute function public.touch_updated_at();
drop trigger if exists sellers_touch        on public.sellers;
create trigger sellers_touch        before update on public.sellers        for each row execute function public.touch_updated_at();
drop trigger if exists team_members_touch   on public.team_members;
create trigger team_members_touch   before update on public.team_members   for each row execute function public.touch_updated_at();
drop trigger if exists prefs_touch          on public.user_preferences;
create trigger prefs_touch          before update on public.user_preferences for each row execute function public.touch_updated_at();
drop trigger if exists reports_touch        on public.reports;
create trigger reports_touch        before update on public.reports        for each row execute function public.touch_updated_at();
drop trigger if exists system_status_touch  on public.system_status;
create trigger system_status_touch  before update on public.system_status  for each row execute function public.touch_updated_at();

-- ── Aggregate RPC for dashboard StatCards ────────────────────────────────
create or replace function public.invoice_stats()
returns json language sql security definer set search_path = public as $$
  select json_build_object(
    'total',    count(*),
    'verified', count(*) filter (where status = 'verified'),
    'pending',  count(*) filter (where status in ('pending','draft','ready')),
    'failed',   count(*) filter (where status in ('invalid','failed'))
  )
  from public.invoices
  where user_id = auth.uid() or auth.uid() is null;
$$;
grant execute on function public.invoice_stats() to anon, authenticated;

-- ── Draft pipeline stats ─────────────────────────────────────────────────
create or replace function public.draft_pipeline_stats()
returns json language sql security definer set search_path = public as $$
  select json_build_object(
    'draft_pipeline_pkr',
       coalesce(sum(total_amount) filter (where status = 'auto-saved'), 0),
    'pending_taxes_pkr',
       coalesce(sum(tax_amount), 0),
    'draft_count',
       count(*)
  )
  from public.drafts
  where user_id = auth.uid();
$$;
grant execute on function public.draft_pipeline_stats() to anon, authenticated;

-- ============================================================================
-- Row-Level Security
-- ============================================================================
alter table public.profiles         enable row level security;
alter table public.invoices         enable row level security;
alter table public.invoice_items    enable row level security;
alter table public.drafts           enable row level security;
alter table public.sellers          enable row level security;
alter table public.verifications    enable row level security;
alter table public.notifications    enable row level security;
alter table public.activity_log     enable row level security;
alter table public.team_members     enable row level security;
alter table public.user_preferences enable row level security;
alter table public.reports          enable row level security;
alter table public.user_sessions    enable row level security;
alter table public.system_status    enable row level security;

-- profiles
drop policy if exists "profiles self read"   on public.profiles;
drop policy if exists "profiles self upsert" on public.profiles;
drop policy if exists "profiles self update" on public.profiles;
create policy "profiles self read"   on public.profiles for select using (auth.uid() = id);
create policy "profiles self upsert" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles self update" on public.profiles for update using (auth.uid() = id);

-- invoices
drop policy if exists "invoices read"   on public.invoices;
drop policy if exists "invoices insert" on public.invoices;
drop policy if exists "invoices update" on public.invoices;
drop policy if exists "invoices delete" on public.invoices;
create policy "invoices read"   on public.invoices for select using (auth.uid() = user_id or user_id is null);
create policy "invoices insert" on public.invoices for insert with check (auth.uid() = user_id or user_id is null);
create policy "invoices update" on public.invoices for update using (auth.uid() = user_id);
create policy "invoices delete" on public.invoices for delete using (auth.uid() = user_id);

-- invoice_items
drop policy if exists "invoice_items read"   on public.invoice_items;
drop policy if exists "invoice_items insert" on public.invoice_items;
drop policy if exists "invoice_items update" on public.invoice_items;
drop policy if exists "invoice_items delete" on public.invoice_items;
create policy "invoice_items read"   on public.invoice_items for select using (
  exists (select 1 from public.invoices i where i.id = invoice_id and (i.user_id = auth.uid() or i.user_id is null))
);
create policy "invoice_items insert" on public.invoice_items for insert with check (
  exists (select 1 from public.invoices i where i.id = invoice_id and (i.user_id = auth.uid() or i.user_id is null))
);
create policy "invoice_items update" on public.invoice_items for update using (
  exists (select 1 from public.invoices i where i.id = invoice_id and i.user_id = auth.uid())
);
create policy "invoice_items delete" on public.invoice_items for delete using (
  exists (select 1 from public.invoices i where i.id = invoice_id and i.user_id = auth.uid())
);

-- drafts
drop policy if exists "drafts read"   on public.drafts;
drop policy if exists "drafts insert" on public.drafts;
drop policy if exists "drafts update" on public.drafts;
drop policy if exists "drafts delete" on public.drafts;
create policy "drafts read"   on public.drafts for select using (auth.uid() = user_id);
create policy "drafts insert" on public.drafts for insert with check (auth.uid() = user_id);
create policy "drafts update" on public.drafts for update using (auth.uid() = user_id);
create policy "drafts delete" on public.drafts for delete using (auth.uid() = user_id);

-- sellers
drop policy if exists "sellers read"   on public.sellers;
drop policy if exists "sellers insert" on public.sellers;
drop policy if exists "sellers update" on public.sellers;
drop policy if exists "sellers delete" on public.sellers;
create policy "sellers read"   on public.sellers for select using (auth.uid() = user_id);
create policy "sellers insert" on public.sellers for insert with check (auth.uid() = user_id);
create policy "sellers update" on public.sellers for update using (auth.uid() = user_id);
create policy "sellers delete" on public.sellers for delete using (auth.uid() = user_id);

-- verifications
drop policy if exists "verifications read"   on public.verifications;
drop policy if exists "verifications insert" on public.verifications;
drop policy if exists "verifications update" on public.verifications;
create policy "verifications read"   on public.verifications for select using (auth.uid() = user_id or user_id is null);
create policy "verifications insert" on public.verifications for insert with check (auth.uid() = user_id or user_id is null);
create policy "verifications update" on public.verifications for update using (auth.uid() = user_id);

-- notifications
drop policy if exists "notifications read"   on public.notifications;
drop policy if exists "notifications insert" on public.notifications;
drop policy if exists "notifications update" on public.notifications;
drop policy if exists "notifications delete" on public.notifications;
create policy "notifications read"   on public.notifications for select using (auth.uid() = user_id or user_id is null);
create policy "notifications insert" on public.notifications for insert with check (auth.uid() = user_id or user_id is null);
create policy "notifications update" on public.notifications for update using (auth.uid() = user_id);
create policy "notifications delete" on public.notifications for delete using (auth.uid() = user_id);

-- activity_log
drop policy if exists "activity read"   on public.activity_log;
drop policy if exists "activity insert" on public.activity_log;
create policy "activity read"   on public.activity_log for select using (auth.uid() = user_id or user_id is null);
create policy "activity insert" on public.activity_log for insert with check (auth.uid() = user_id or user_id is null);

-- team_members (scoped by org_id = owner's profile.org_id)
drop policy if exists "team read"   on public.team_members;
drop policy if exists "team insert" on public.team_members;
drop policy if exists "team update" on public.team_members;
drop policy if exists "team delete" on public.team_members;
create policy "team read"   on public.team_members for select using (
  org_id in (select org_id from public.profiles where id = auth.uid())
);
create policy "team insert" on public.team_members for insert with check (
  org_id in (select org_id from public.profiles where id = auth.uid())
);
create policy "team update" on public.team_members for update using (
  org_id in (select org_id from public.profiles where id = auth.uid())
);
create policy "team delete" on public.team_members for delete using (
  org_id in (select org_id from public.profiles where id = auth.uid())
);

-- user_preferences
drop policy if exists "prefs read"   on public.user_preferences;
drop policy if exists "prefs upsert" on public.user_preferences;
drop policy if exists "prefs update" on public.user_preferences;
create policy "prefs read"   on public.user_preferences for select using (auth.uid() = user_id);
create policy "prefs upsert" on public.user_preferences for insert with check (auth.uid() = user_id);
create policy "prefs update" on public.user_preferences for update using (auth.uid() = user_id);

-- reports
drop policy if exists "reports read"   on public.reports;
drop policy if exists "reports insert" on public.reports;
drop policy if exists "reports update" on public.reports;
drop policy if exists "reports delete" on public.reports;
create policy "reports read"   on public.reports for select using (auth.uid() = user_id);
create policy "reports insert" on public.reports for insert with check (auth.uid() = user_id);
create policy "reports update" on public.reports for update using (auth.uid() = user_id);
create policy "reports delete" on public.reports for delete using (auth.uid() = user_id);

-- user_sessions
drop policy if exists "sessions read"   on public.user_sessions;
drop policy if exists "sessions insert" on public.user_sessions;
drop policy if exists "sessions delete" on public.user_sessions;
create policy "sessions read"   on public.user_sessions for select using (auth.uid() = user_id);
create policy "sessions insert" on public.user_sessions for insert with check (auth.uid() = user_id);
create policy "sessions delete" on public.user_sessions for delete using (auth.uid() = user_id);

-- system_status (read for anyone signed in)
drop policy if exists "status read" on public.system_status;
create policy "status read" on public.system_status for select using (auth.uid() is not null);

-- ============================================================================
-- Company branding — profiles.logo_url + profiles.barcode_url + public `logos`
-- storage bucket (holds both logo and barcode images).
-- Idempotent: safe to re-run on an existing database.
-- ============================================================================
alter table public.profiles add column if not exists logo_url    text;
alter table public.profiles add column if not exists barcode_url text;

-- ── Self-heal existing tables (add columns the code/triggers rely on) ───────
-- `create table if not exists` never alters an existing table, so columns
-- added to this schema after the first deploy must be back-filled explicitly.
alter table public.profiles add column if not exists org_id        uuid;
update public.profiles set org_id = id where org_id is null;     -- each user owns their own org
alter table public.invoices add column if not exists hash_checksum text;
alter table public.invoices add column if not exists qr_code       text;

insert into storage.buckets (id, name, public)
values ('logos', 'logos', true)
on conflict (id) do nothing;

-- Logos are public to read; each user may only write within their own id folder
-- (path layout: `<user_id>/logo.<ext>`).
drop policy if exists "logos public read" on storage.objects;
drop policy if exists "logos owner write" on storage.objects;
drop policy if exists "logos owner update" on storage.objects;
drop policy if exists "logos owner delete" on storage.objects;

create policy "logos public read" on storage.objects
  for select using (bucket_id = 'logos');
create policy "logos owner write" on storage.objects
  for insert with check (bucket_id = 'logos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "logos owner update" on storage.objects
  for update using (bucket_id = 'logos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "logos owner delete" on storage.objects
  for delete using (bucket_id = 'logos' and (storage.foldername(name))[1] = auth.uid()::text);
