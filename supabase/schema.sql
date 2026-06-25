create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  icon text,
  image text,
  seo_title text,
  seo_description text,
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists games (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  category_id uuid references categories(id),
  category_slug text,
  thumbnail text,
  iframe_url text not null,
  short_description text,
  description text,
  instructions text,
  rating numeric default 4.5,
  plays bigint default 0,
  is_new boolean default false,
  is_trending boolean default false,
  is_hot boolean default false,
  is_popular boolean default false,
  is_featured boolean default false,
  is_active boolean default true,
  seo_title text,
  seo_description text,
  published_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  created_at timestamptz default now()
);

create table if not exists game_tags (
  game_id uuid references games(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (game_id, tag_id)
);

create table if not exists game_reports (
  id uuid primary key default gen_random_uuid(),
  game_id uuid references games(id) on delete cascade,
  game_slug text,
  reason text not null,
  details text,
  status text default 'new',
  created_at timestamptz default now()
);

create table if not exists game_events (
  id uuid primary key default gen_random_uuid(),
  game_id uuid references games(id) on delete cascade,
  game_slug text,
  event_type text not null,
  created_at timestamptz default now()
);

create table if not exists ai_providers (
  id uuid primary key default gen_random_uuid(),
  provider_key text unique not null,
  provider_name text not null,
  -- TODO: Replace plain text storage with proper encryption/KMS before serious production use.
  api_key_encrypted text,
  base_url text,
  default_model text,
  is_enabled boolean default false,
  is_default boolean default false,
  settings jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists ai_generation_logs (
  id uuid primary key default gen_random_uuid(),
  provider_key text,
  model text,
  target_type text not null,
  target_id text,
  target_slug text,
  action text not null,
  prompt text,
  result text,
  status text default 'success',
  error_message text,
  tokens_input int,
  tokens_output int,
  cost_estimate numeric,
  created_at timestamptz default now()
);

create table if not exists ai_prompt_templates (
  id uuid primary key default gen_random_uuid(),
  template_key text unique not null,
  name text not null,
  description text,
  target_type text,
  action text,
  variables jsonb default '[]'::jsonb,
  system_prompt text,
  user_prompt text not null,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists game_comments (
  id uuid primary key default gen_random_uuid(),
  game_id uuid references games(id) on delete cascade,
  game_slug text not null,
  name text not null,
  email text,
  comment text not null,
  status text default 'pending',
  ip_hash text,
  user_agent text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  status text default 'new',
  admin_note text,
  ip_hash text,
  user_agent text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists site_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value text,
  value_type text default 'text',
  group_name text default 'general',
  label text,
  description text,
  is_public boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists cron_publish_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value text,
  value_type text default 'text',
  updated_at timestamptz default now()
);

create table if not exists cron_publish_logs (
  id uuid primary key default gen_random_uuid(),
  run_id text not null,
  game_id uuid,
  game_slug text,
  status text not null,
  step text,
  message text,
  article_generated boolean default false,
  meta_description_generated boolean default false,
  published boolean default false,
  error_message text,
  created_at timestamptz default now()
);

create index if not exists idx_games_slug on games (slug);
create index if not exists idx_games_category_slug on games (category_slug);
create index if not exists idx_games_is_active on games (is_active);
create index if not exists idx_games_is_new on games (is_new);
create index if not exists idx_games_is_trending on games (is_trending);
create index if not exists idx_games_is_hot on games (is_hot);
create index if not exists idx_games_is_popular on games (is_popular);
create index if not exists idx_games_is_featured on games (is_featured);
create index if not exists idx_games_published_at on games (published_at);
create index if not exists idx_games_plays on games (plays);
create index if not exists idx_games_title_trgm on games using gin (title gin_trgm_ops);
create index if not exists idx_games_active_published_at on games (is_active, published_at desc);
create index if not exists idx_games_active_plays on games (is_active, plays desc);
create index if not exists idx_games_active_rating on games (is_active, rating desc);
create index if not exists idx_games_category_active_published on games (category_slug, is_active, published_at desc);
create index if not exists idx_categories_slug on categories (slug);
create index if not exists idx_categories_active_sort on categories (is_active, sort_order, name);
create index if not exists idx_game_events_game_id on game_events (game_id);
create index if not exists idx_game_events_game_slug on game_events (game_slug);
create index if not exists idx_game_events_event_type on game_events (event_type);
create index if not exists idx_ai_providers_provider_key on ai_providers (provider_key);
create index if not exists idx_ai_providers_is_enabled on ai_providers (is_enabled);
create index if not exists idx_ai_providers_is_default on ai_providers (is_default);
create index if not exists idx_ai_generation_logs_provider_key on ai_generation_logs (provider_key);
create index if not exists idx_ai_generation_logs_target_type on ai_generation_logs (target_type);
create index if not exists idx_ai_generation_logs_target_slug on ai_generation_logs (target_slug);
create index if not exists idx_ai_generation_logs_action on ai_generation_logs (action);
create index if not exists idx_ai_generation_logs_created_at on ai_generation_logs (created_at);
create index if not exists idx_ai_prompt_templates_template_key on ai_prompt_templates (template_key);
create index if not exists idx_ai_prompt_templates_is_active on ai_prompt_templates (is_active);
create index if not exists idx_ai_prompt_templates_target_type on ai_prompt_templates (target_type);
create index if not exists idx_ai_prompt_templates_action on ai_prompt_templates (action);
create index if not exists idx_game_reports_game_id on game_reports (game_id);
create index if not exists idx_game_reports_status on game_reports (status);
create index if not exists idx_game_comments_game_slug on game_comments (game_slug);
create index if not exists idx_game_comments_status on game_comments (status);
create index if not exists idx_game_comments_created_at on game_comments (created_at);
create index if not exists idx_contact_messages_status on contact_messages (status);
create index if not exists idx_contact_messages_created_at on contact_messages (created_at);
create index if not exists idx_contact_messages_email on contact_messages (email);
create index if not exists idx_site_settings_key on site_settings (key);
create index if not exists idx_site_settings_group_name on site_settings (group_name);
create index if not exists idx_site_settings_is_public on site_settings (is_public);
create index if not exists idx_cron_publish_settings_key on cron_publish_settings (key);
create index if not exists idx_cron_publish_logs_run_id on cron_publish_logs (run_id);
create index if not exists idx_cron_publish_logs_game_slug on cron_publish_logs (game_slug);
create index if not exists idx_cron_publish_logs_status on cron_publish_logs (status);
create index if not exists idx_cron_publish_logs_created_at on cron_publish_logs (created_at);

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_categories_updated_at on categories;
create trigger set_categories_updated_at
before update on categories
for each row
execute function set_updated_at();

drop trigger if exists set_games_updated_at on games;
create trigger set_games_updated_at
before update on games
for each row
execute function set_updated_at();

drop trigger if exists set_ai_providers_updated_at on ai_providers;
create trigger set_ai_providers_updated_at
before update on ai_providers
for each row
execute function set_updated_at();

drop trigger if exists set_ai_prompt_templates_updated_at on ai_prompt_templates;
create trigger set_ai_prompt_templates_updated_at
before update on ai_prompt_templates
for each row
execute function set_updated_at();

drop trigger if exists set_game_comments_updated_at on game_comments;
create trigger set_game_comments_updated_at
before update on game_comments
for each row
execute function set_updated_at();

drop trigger if exists set_contact_messages_updated_at on contact_messages;
create trigger set_contact_messages_updated_at
before update on contact_messages
for each row
execute function set_updated_at();

drop trigger if exists set_site_settings_updated_at on site_settings;
create trigger set_site_settings_updated_at
before update on site_settings
for each row
execute function set_updated_at();

drop trigger if exists set_cron_publish_settings_updated_at on cron_publish_settings;
create trigger set_cron_publish_settings_updated_at
before update on cron_publish_settings
for each row
execute function set_updated_at();
