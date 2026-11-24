create table categories (
  id serial primary key,
  name text unique not null,
  slug text unique not null
);
create table posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  summary text,
  body text,
  category_id int references categories(id) on delete set null,
  region text default 'World' check (region in ('Nigeria','Africa','World')),
  sponsored boolean default false,
  published boolean default true,
  views int default 0,
  created_at timestamptz default now()
);
create or replace function increment_views(p_slug text) returns void
language sql security definer as $$ update posts set views = views + 1 where slug = p_slug $$;

alter table categories enable row level security;
alter table posts enable row level security;
create policy "read categories" on categories for select using (true);
create policy "read posts" on posts for select using (published = true or auth.role() = 'authenticated');
create policy "admin categories" on categories for all to authenticated using (true) with check (true);
create policy "admin posts" on posts for all to authenticated using (true) with check (true);

insert into categories (name, slug) values
  ('Trending','trending'),('Travel News','travel-news'),('International','international'),('Interviews','interviews');

-- Newsletter sign-ups
create table subscribers (
  id serial primary key,
  email text unique not null,
  created_at timestamptz default now()
);
alter table subscribers enable row level security;
create policy "anyone can subscribe" on subscribers for insert to anon, authenticated with check (true);
create policy "admin reads subscribers" on subscribers for select to authenticated using (true);
