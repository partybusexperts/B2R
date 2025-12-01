create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null default '0bad4d72-82be-442b-a8eb-f7e18b587e95'::uuid,
  slug text not null unique,
  title text not null,
  excerpt text not null,
  author text,
  hero_image_url text,
  thumbnail_url text,
  published_at timestamptz not null default now(),
  keywords text[] not null default '{}'::text[],
  paragraphs text[] not null default '{}'::text[],
  related_slugs text[] not null default '{}'::text[],
  custom_page boolean not null default false,
  content text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_published_at_idx on public.blog_posts (published_at desc);
create index if not exists blog_posts_slug_idx on public.blog_posts (slug);
