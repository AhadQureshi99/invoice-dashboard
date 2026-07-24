-- Per-company product catalog. Each product belongs to ONE seller company, so a
-- draft's product search can be scoped to whichever company is selected.
create table if not exists public.products (
  id           uuid          primary key default uuid_generate_v4(),
  user_id      uuid          not null references auth.users(id) on delete cascade,
  seller_id    uuid          references public.sellers(id) on delete cascade,
  description  text          not null,
  hs_code      text          default '',
  uom          text          default '',
  unit_price   numeric(18,2) default 0,
  created_at   timestamptz   default now(),
  updated_at   timestamptz   default now()
);
create index if not exists products_seller_id_idx on public.products(seller_id);
create index if not exists products_user_id_idx   on public.products(user_id);

alter table public.products enable row level security;

drop policy if exists "products read"   on public.products;
drop policy if exists "products insert" on public.products;
drop policy if exists "products update" on public.products;
drop policy if exists "products delete" on public.products;
create policy "products read"   on public.products for select using (auth.uid() = user_id);
create policy "products insert" on public.products for insert with check (auth.uid() = user_id);
create policy "products update" on public.products for update using (auth.uid() = user_id);
create policy "products delete" on public.products for delete using (auth.uid() = user_id);
