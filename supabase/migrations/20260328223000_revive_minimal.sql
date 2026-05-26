create extension if not exists vector;
create extension if not exists pgcrypto;

create table if not exists collections (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists items (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references collections(id) on delete cascade,
  source_url text,
  source_type text not null,
  title text not null,
  content_text text not null,
  content_markdown text,
  import_status text not null default 'completed',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists chunks (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references items(id) on delete cascade,
  collection_id uuid not null references collections(id) on delete cascade,
  chunk_index integer not null,
  text text not null,
  embedding vector(1536) not null
);

create table if not exists task_runs (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references collections(id) on delete cascade,
  user_query text not null,
  result_json jsonb not null,
  citations_json jsonb not null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_items_collection_id on items(collection_id);
create index if not exists idx_chunks_collection_id on chunks(collection_id);
create index if not exists idx_task_runs_collection_id on task_runs(collection_id);
create index if not exists idx_chunks_embedding on chunks using ivfflat (embedding vector_cosine_ops) with (lists = 100);

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists collections_set_updated_at on collections;
create trigger collections_set_updated_at
before update on collections
for each row
execute function set_updated_at();

drop trigger if exists items_set_updated_at on items;
create trigger items_set_updated_at
before update on items
for each row
execute function set_updated_at();
