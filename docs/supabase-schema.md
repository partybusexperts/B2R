# Supabase schema to match `types/*.types.ts`

This project currently uses mock fallbacks in `lib/data/*`. The goal of this document is to align your **TypeScript types** in `types/*.types.ts` with **actual Postgres tables** in Supabase so the app can rely on real data.

## What already exists in Supabase (use/extend)

From the current `public` schema:

- ✅ `homepage_hero` (4 rows; matches `HeroData` / `getHeroBySlug`)
- ✅ `polls1` + `poll_options1` (~51k polls / ~202k options; app reads these and votes via `increment_poll_vote1()`; header stats via `poll_header_stats`)
- ✅ `reviews` (15 rows; includes `tags text[]`)
- ✅/⚠️ `tools` (89 rows; still missing `icon_name`/`modal_content`/`cta_*`, has extra columns like `Code`)
- ✅ `events` (13 rows; now matches `EventData` shape used by the UI)
- ✅/⚠️ `faqs` (591 rows; `id uuid`, `page_slug text`, `click_count int default 0`)
- ⚠️ `blog_posts` (31 rows; code currently queries `blogs`, so you likely want a `blogs` view over `blog_posts`)
- ✅ `content_sections` (4 rows; matches `ContentSectionData` / `getContentBySlug`)
- ✅ `locations` (4 rows; `city_slug/state_slug` routing + JSONB content blocks)
- ✅ `vehicles` (53 rows; seeded from Storage `vehicles1`)

Not currently present in Supabase (but used by fetchers/pages):

- ❌ `blogs` (view/table; `lib/data/blog.ts` queries `from('blogs')`)

This doc recommends **ALTER** where safe and **CREATE** where missing.

---

## Recommended target tables (by TypeScript type)

### 1) `VehicleData` → `public.vehicles`

Source type: `types/vehicle.types.ts`

Live scan (Dec 2025) of `public.vehicles`:

- `type public.vehicle_type` exists, but is currently **nullable** (recommended: set `NOT NULL`)
- `min_hours int4 default 1`
- `created_at` / `updated_at` are present with `default now()`
- indexes: unique `slug`, index on `type`

**Target columns**

| column         | postgres type         | null | notes                                                                               |
| -------------- | --------------------- | ---: | ----------------------------------------------------------------------------------- |
| `id`           | `uuid`                |   no | `default gen_random_uuid()`                                                         |
| `name`         | `text`                |   no |                                                                                     |
| `slug`         | `text`                |   no | unique; used in routes (`/vehicles/[slug]`)                                         |
| `type`         | `public.vehicle_type` |   no | enum: `party-bus`, `limo`, `coach` (DB currently allows null; should be `NOT NULL`) |
| `images`       | `text[]`              |  yes | store storage keys or full URLs                                                     |
| `capacity`     | `text`                |  yes | current UI expects text search like `24 pax`                                        |
| `price_hourly` | `text`                |  yes | formatted string for now (e.g. `$150`)                                              |
| `min_hours`    | `integer`             |  yes | default `1`                                                                         |
| `description`  | `text`                |  yes |                                                                                     |
| `amenities`    | `text[]`              |  yes | free-form strings; UI does partial matching                                         |
| `created_at`   | `timestamptz`         |  yes | `default now()` (DB currently nullable; recommended: set `NOT NULL`)                |
| `updated_at`   | `timestamptz`         |  yes | `default now()` (DB currently nullable; recommended: set `NOT NULL`)                |

**Indexes / constraints**

- `unique (slug)` (exists)
- `index (type)` (exists: `vehicles_type_idx`)
- optional: `index (min_hours)` (recommended; not currently present)

**Migration SQL (target definition)**

```sql
do $$
begin
  create type public.vehicle_type as enum ('party-bus','limo','coach');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  type public.vehicle_type not null,
  name text not null,
  slug text not null unique,
  description text,
  price_hourly text,
  min_hours integer default 1,
  capacity text,
  amenities text[],
  images text[]
);

create index if not exists vehicles_type_idx on public.vehicles (type);
create index if not exists vehicles_min_hours_idx on public.vehicles (min_hours);
```

### Population (already done): seed from Storage `vehicles1`

You’ve already populated `public.vehicles` from the Storage bucket `vehicles1`.

Migration script (idempotent upsert):

- [lib/supabase/migrations/2025-12-12_seed_vehicles_from_storage.cjs](lib/supabase/migrations/2025-12-12_seed_vehicles_from_storage.cjs)

This approach sets:

- `name` from the folder name
- `capacity` from the first number in the folder name (stored as `"NN pax"`)
- `type` inferred from keywords in the folder name (`limo`, `party`, `coach`)
- `images` as Storage keys like `"{folder}/{file}"`

If you ever need the legacy import from `vehicles11`, you can re-add it here, but it’s no longer the primary path.

---

### 2) `ToolData` → extend `public.tools`

Source type: `types/tools.types.ts`

Live scan (Dec 2025) of `public.tools`:

- Row count: 89
- Columns include: `id,title,description,category,href,status,compute_kind,inputs_schema,version,is_featured,created_at,updated_at,slug,is_active,...`
- `ToolData` in the app expects: `icon_name`, `modal_content`, `cta_text`, `cta_link` (these are still missing)
- There are unique indexes on `id` and `slug` already

**Target columns (additions)**

| column          | postgres type | null | notes                                                     |
| --------------- | ------------- | ---: | --------------------------------------------------------- |
| `icon_name`     | `text`        |  yes | Lucide icon name (`"calculator"`, `"shield-check"`, etc.) |
| `modal_content` | `text`        |  yes | HTML/Markdown string rendered in dialog                   |
| `cta_text`      | `text`        |  yes |                                                           |
| `cta_link`      | `text`        |  yes |                                                           |

**Migration SQL (alter table)**

```sql
alter table public.tools
  add column if not exists icon_name text,
  add column if not exists modal_content text,
  add column if not exists cta_text text,
  add column if not exists cta_link text;

-- optional backfill
update public.tools
set cta_link = coalesce(cta_link, href)
where cta_link is null;
```

Note: if you’re using this repo as the source of truth, run the SQL in Supabase (Dashboard → SQL Editor). The app’s fetchers will fall back to mocks until these columns exist.

---

### 3) `ReviewsData` (+ tags) → extend `public.reviews`

Source type: `types/reviews.types.ts`

Live scan (Dec 2025) of `public.reviews`:

- Row count: 15
- Columns include: `slug`, `source`, `source_id`, `source_url`, `author_display`, `rating`, `body`, `event_slug`, `city_slug`, `state_slug`, `service_date`, `created_at`, `published_at`, `tags`.
- `tags text[]` now exists and there is a `reviews_tags_gin` index.

**Schema note**

This is now aligned with the UI’s tag filtering. If you need this in a fresh environment, these were the changes:

```sql
alter table public.reviews
  add column if not exists tags text[];

create index if not exists reviews_tags_gin on public.reviews using gin (tags);
```

---

### 4) `PollData` → `public.polls`

Source type: `PollWithOptions` (exported from `lib/data/polls.ts`)

**Important:** the app has migrated to `polls1` / `poll_options1`.

- Read path:
  - [lib/data/polls.ts](lib/data/polls.ts): `getPolls()` selects from `polls1` and joins `poll_options1` as `options`.
  - [components/sections/poll-card.tsx](components/sections/poll-card.tsx) renders `poll.options` and uses `vote_count` for results.
- Write path:
  - [components/sections/poll-card.tsx](components/sections/poll-card.tsx) calls `supabase.rpc('increment_poll_vote1', { p_option_id })`.
- Results page:
  - [lib/data/polls.ts](lib/data/polls.ts): `getPollResults()` computes totals/percentages from `poll_options1.vote_count` (not from `poll_results_view`).
  - `getPollResultsHeaderData()` reads `poll_header_stats`.

The legacy `public.polls` table (5 rows, with `options jsonb[]` + `votes jsonb`) still exists, but it is no longer the data source for the UI.

#### Target schema (current production path)

`public.polls1` (poll question + display flags)

| column                 | postgres type | null | notes                                                                            |
| ---------------------- | ------------- | ---: | -------------------------------------------------------------------------------- |
| `id`                   | `uuid`        |   no | `default gen_random_uuid()`                                                      |
| `slug`                 | `text`        |   no | unique; stable identifier                                                        |
| `question`             | `text`        |   no |                                                                                  |
| `category_slug`        | `text`        |  yes | used by [components/sections/polls-grid.tsx](components/sections/polls-grid.tsx) |
| `main_category`        | `text`        |  yes | optional grouping                                                                |
| `is_active`            | `bool`        |  yes | recommended: filter `true` in fetchers                                           |
| `multi_select`         | `bool`        |  yes | future capability (UI currently treats as single select)                         |
| `show_on_home`         | `bool`        |  yes | optional targeting                                                               |
| `show_on_polls`        | `bool`        |  yes | optional targeting                                                               |
| `show_on_vehicle_page` | `bool`        |  yes | optional targeting                                                               |
| `show_on_city_page`    | `bool`        |  yes | optional targeting                                                               |
| `meta_json`            | `jsonb`       |   no | default `{}`                                                                     |
| `created_at`           | `timestamptz` |  yes | default `now()`                                                                  |

`public.poll_options1` (answers + counts)

| column       | postgres type | null | notes                             |
| ------------ | ------------- | ---: | --------------------------------- |
| `id`         | `uuid`        |   no | `default gen_random_uuid()`       |
| `poll_id`    | `uuid`        |   no | FK → `polls1.id`                  |
| `label`      | `text`        |   no | display label                     |
| `slug`       | `text`        |   no | per-poll unique (`poll_id, slug`) |
| `ord`        | `int4`        |   no | sort order used by `getPolls()`   |
| `vote_count` | `int4`        |   no | default `0`                       |

#### RPC for voting

`public.increment_poll_vote1(p_option_id uuid) returns void` (SECURITY DEFINER)

- updates `poll_options1.vote_count = vote_count + 1` for the option row
- this lets you keep RLS strict on tables while still allowing anonymous voting

#### Views

- `public.poll_header_stats` (used by `getPollResultsHeaderData()`)
- `public.poll_results_view` currently exists, but the app no longer depends on it (safe to keep for analytics/BI, or replace with a view built over `polls1`/`poll_options1`)

---

### 5) `FaqData` → extend `public.faqs`

Source type: `types/faq.types.ts`

Live scan (Dec 2025) of `public.faqs`:

- Row count: 591
- Current schema: `id uuid primary key default gen_random_uuid()`, plus `page_slug`, `question`, `answer`, `sort_order default 0`, `click_count int not null default 0`, timestamps.

**Schema note:** Your `lib/data/faqs.ts` fetchers already order by `click_count` and filter by `page_slug`, which matches the current Supabase schema.

**Click count update (already implemented)**

- DB: `public.increment_faq_click(p_id uuid)` exists and is `SECURITY DEFINER`.
- Grants: `EXECUTE` is granted to `PUBLIC`.
- UI: [components/sections/faq-client.tsx](components/sections/faq-client.tsx) calls `supabase.rpc('increment_faq_click', { p_id: faq.id })` on accordion open.

If you want to harden against abuse later, add lightweight rate-limiting on the client (dedupe per session) and/or move the increment behind a Next.js route.

---

### 6) `EventData` → extend `public.events`

Source type: `types/events.types.ts`

Live scan (Dec 2025) of `public.events`:

- Row count: 13
- Columns: `id uuid`, `slug text`, `title text`, `description text`, `images text[]`, `date_range timestamptz`, `category text`, `created_at/updated_at timestamptz`
- Indexes: unique `slug` (plus PK)

**App alignment**

- `EventData` is derived from the Supabase row type (`types/events.types.ts`).
- The UI uses:
  - `images` as Storage keys in bucket `Events1` (see [components/sections/events-card.tsx](components/sections/events-card.tsx))
  - `date_range` as a display string (Supabase returns `timestamptz` as a string)

**Recommended small improvements (optional)**

- Add an index on `category` if you start filtering by it.
- If `date_range` is intended to be a human string like `"Oct 20-22"`, consider changing it to `text` or adding a separate `date_range_text` column.

```sql
create index if not exists events_category_idx on public.events (category);
```

---

### 7) `ContentSectionData` → `public.content_sections` (✅ exists)

Source type: `types/content_sections.types.ts`

Used by `getContentBySlug()` (`lib/data/content_section.ts`) and rendered via `ContentFeatures`.

Rendered in the UI by:

- [components/sections/content-section.tsx](components/sections/content-section.tsx) (section content + bullets + image)
- [components/sections/content-features.tsx](components/sections/content-features.tsx) + [components/sections/content-features.client.tsx](components/sections/content-features.client.tsx) (feature cards + modal)

Live scan (Dec 2025) of `public.content_sections`:

- Row count: 4
- Primary key: `slug` (unique index `content_sections_pkey`)
- Columns: `slug,title,content,bullets text[],image_keys text[],features jsonb,created_at,updated_at`

**Notes**

- `features` is stored as `jsonb` and is treated as an array.
- The feature modal is already implemented client-side; it expects additional optional fields on each feature.
- `content` and `modal_content_html` are rendered via `dangerouslySetInnerHTML`, so treat these values as trusted content (or sanitize before writing).
- The fetcher currently has a small mock fallback if a slug is missing; once you’ve seeded all slugs used by pages, you can remove that fallback.

**Current app feature contract (what to store in `features jsonb`)**

Each feature item should look like:

| field                | type   | required | used for                       |
| -------------------- | ------ | -------: | ------------------------------ |
| `title`              | `text` |      yes | card + modal title fallback    |
| `description`        | `text` |      yes | card + modal subtitle fallback |
| `icon`               | `text` |      yes | `DynamicIcon` name             |
| `modal_title`        | `text` |       no | modal header title             |
| `modal_subtitle`     | `text` |       no | modal header subtitle          |
| `modal_content_html` | `text` |       no | modal body HTML                |
| `cta_label`          | `text` |       no | CTA label fallback             |
| `cta_href`           | `text` |       no | CTA link fallback              |

If `modal_content_html` is missing, the UI shows a friendly “More details coming soon” placeholder.

**Target columns**

| column       | postgres type | null | notes                                                         |
| ------------ | ------------- | ---: | ------------------------------------------------------------- |
| `slug`       | `text`        |   no | primary key or unique                                         |
| `title`      | `text`        |   no |                                                               |
| `content`    | `text`        |  yes | HTML/Markdown string (rendered via `dangerouslySetInnerHTML`) |
| `bullets`    | `text[]`      |  yes |                                                               |
| `image_keys` | `text[]`      |  yes | Supabase Storage keys (bucket handled in UI)                  |
| `features`   | `jsonb`       |  yes | array of `{ title, description, icon }`                       |
| `created_at` | `timestamptz` |   no | default `now()`                                               |
| `updated_at` | `timestamptz` |   no | default `now()`                                               |

```sql
create table if not exists public.content_sections (
  slug text primary key,
  title text not null,
  content text,
  bullets text[],
  image_keys text[],
  features jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

**Update required (MVP, no schema change)**

You do _not_ need to alter Postgres to support the new modal fields because `features` is already `jsonb`.

What you _do_ need is to backfill/seed `content_sections.features` with the extended objects (add `modal_*` + `cta_*` fields) for the slugs you’re rendering.

Example `features` value:

```json
[
  {
    "title": "Comfortable Seating",
    "description": "Ensure everyone has a comfortable ride",
    "icon": "check-circle",
    "modal_title": "Comfortable seating for every guest",
    "modal_subtitle": "What to look for in a high-quality bus",
    "modal_content_html": "<h3>Why it matters</h3><p>...</p>",
    "cta_label": "Get a quote",
    "cta_href": "/contact"
  }
]
```

**Senior-level Supabase architecture (recommended)**

If you want this to scale cleanly (feature ordering, editing, analytics, future localization), normalize features into their own table and (optionally) provide an aggregation view for the app.

This keeps `content_sections` as the section header/body, and `content_section_features` as the feature cards/modals.

```sql
-- 1) Keep section-level content in one row per slug
create table if not exists public.content_sections (
  slug text primary key,
  title text not null,
  content text,
  bullets text[],
  image_keys text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) Normalize feature cards/modals
create table if not exists public.content_section_features (
  id uuid primary key default gen_random_uuid(),
  section_slug text not null references public.content_sections(slug) on delete cascade,
  sort_order int not null default 0,
  title text not null,
  description text not null,
  icon text not null,
  modal_title text,
  modal_subtitle text,
  modal_content_html text,
  cta_label text,
  cta_href text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists content_section_features_section_slug_idx
  on public.content_section_features(section_slug);

create index if not exists content_section_features_order_idx
  on public.content_section_features(section_slug, sort_order);

-- 3) Optional: a view that returns the exact JSON shape the app expects today
create or replace view public.content_sections_with_features as
select
  cs.slug,
  cs.title,
  cs.content,
  cs.bullets,
  cs.image_keys,
  cs.created_at,
  cs.updated_at,
  coalesce(
    jsonb_agg(
      jsonb_build_object(
        'title', f.title,
        'description', f.description,
        'icon', f.icon,
        'modal_title', f.modal_title,
        'modal_subtitle', f.modal_subtitle,
        'modal_content_html', f.modal_content_html,
        'cta_label', f.cta_label,
        'cta_href', f.cta_href
      )
      order by f.sort_order asc
    ) filter (where f.id is not null),
    '[]'::jsonb
  ) as features
from public.content_sections cs
left join public.content_section_features f
  on f.section_slug = cs.slug
group by cs.slug;
```

**How to adopt the recommended architecture**

1. Create the `content_section_features` table and `content_sections_with_features` view.
2. Seed your features into `content_section_features`.
3. Update the fetcher to read from the view (minimal code change):
   - change `.from("content_sections")` to `.from("content_sections_with_features")`.

If you prefer _zero_ code changes, keep using `features jsonb` directly in `content_sections` (MVP plan above).

---

### 8) Locations (directory + city/state pages) → `public.locations` (✅ exists)

Used by location routes + directory:

- Directory page reads minimal fields via `getAllLocations()` ([lib/data/locations.ts](lib/data/locations.ts)) for [app/locations/page.tsx](app/locations/page.tsx)
- City page uses `getLocationBySlugs(state_slug, city_slug)` for [app/locations/state/[state_slug]/city/[city_slug]/page.tsx](app/locations/state/[state_slug]/city/[city_slug]/page.tsx)
- State page uses `getLocationsByState(state_slug)` for [app/locations/state/[state_slug]/page.tsx](app/locations/state/[state_slug]/page.tsx)

Live scan (Dec 2025) of `public.locations`:

- Row count: 4
- Columns: `id uuid`, `created_at timestamptz`, `name`, `city_name`, `city_slug`, `state_name`, `state_slug`, `available_fleet_types text[]`, `coordinates jsonb`, `trivia jsonb`, `local_events jsonb`, `neighborhood_vibes jsonb`, `seasonal_guide jsonb`
- Indexes: PK `id`, unique `(state_slug, city_slug)`

**Current data contract expected by pages/components**

- `coordinates` is a JSON object: `{ "lat": number, "lng": number }` (used by `LiveConditions`)
- `trivia` is a JSON array of `{ question, answer, icon }` (used by `LocationTrivia`)
- `local_events`, `neighborhood_vibes` are JSON arrays of `{ title, icon, short_desc, modal_content }` (used by `LocationInfoGrid`)
- `seasonal_guide` is a JSON object of `{ title, icon, short_desc, modal_content }` (also used by `LocationInfoGrid`)
- `available_fleet_types` is a list of allowed fleet types (`party-bus`, `limo`, `coach`) used for `/locations/state/[state_slug]/city/[city_slug]/[fleet_slug]` gating

**Important code/schema alignment note**

`public.locations` is city-granularity (unique by `(state_slug, city_slug)`). That means:

- `getLocationByCity(city_slug)` will only be safe if `city_slug` is globally unique across all states.
- `getLocationsByState(state_slug)` should likely return _many_ rows (cities), not a single row.

Senior-level fix (recommended): keep cities in `locations`, and add a `states` view/table for the state page.

#### Recommended schema hardening (senior-level)

1. Add `updated_at` so content edits are traceable:

```sql
alter table public.locations
  add column if not exists updated_at timestamptz not null default now();
```

2. Add indexes that match your access patterns:

```sql
create index if not exists locations_city_slug_idx on public.locations (city_slug);
create index if not exists locations_state_slug_idx on public.locations (state_slug);
```

3. Prefer a typed enum array for `available_fleet_types`:

- Today it is `text[]`.
- Recommended: `public.vehicle_type[]` (re-uses the enum you already have for vehicles).

```sql
alter table public.locations
  add column if not exists available_fleet_types_v2 public.vehicle_type[];

-- backfill (best-effort)
update public.locations
set available_fleet_types_v2 = (
  select coalesce(array_agg(v::public.vehicle_type), '{}'::public.vehicle_type[])
  from unnest(coalesce(available_fleet_types, '{}'::text[])) as t(v)
);
```

4. Add a `states` view for the state page (one row per state):

```sql
create or replace view public.location_states as
select
  state_slug,
  max(state_name) as state_name,
  jsonb_build_object(
    'lat', avg((coordinates->>'lat')::float8),
    'lng', avg((coordinates->>'lng')::float8)
  ) as coordinates,
  array_agg(city_slug order by city_name) as city_slugs
from public.locations
group by state_slug;
```

Plan: update `getLocationsByState()` to query `location_states` for the state page header content, and separately fetch the list of cities with `.select('*').eq('state_slug', stateSlug)`.

---

### 9) `BlogData` / `PostData` → extend `public.blog_posts` (and/or add a `blogs` view)

Source type: `types/blog.types.ts`

Current Supabase table is `blog_posts` with: `slug,title,excerpt,content,thumbnail_url,published_at`.

**Recommended: add missing columns + map app to use `blog_posts`**

Add columns:

| column     | postgres type | null | maps to TS |
| ---------- | ------------- | ---: | ---------- |
| `category` | `text`        |  yes | `category` |
| `author`   | `text`        |  yes | `author`   |
| `tags`     | `text[]`      |  yes | `tags`     |

```sql
alter table public.blog_posts
  add column if not exists category text,
  add column if not exists author text,
  add column if not exists tags text[];

create index if not exists blog_posts_published_at_idx on public.blog_posts (published_at);
create index if not exists blog_posts_tags_gin on public.blog_posts using gin (tags);
```

**Image field**

- TS uses `image`.
- DB has `thumbnail_url`.
- Either update the app to map `image <- thumbnail_url`, OR add a generated column:

```sql
alter table public.blog_posts
  add column if not exists image text;

update public.blog_posts
set image = coalesce(image, thumbnail_url)
where image is null;
```

**Optional compatibility view (if you want the app to keep querying `from('blogs')`)**

```sql
create or replace view public.blogs as
select
  id,
  title,
  slug,
  excerpt,
  content,
  coalesce(image, thumbnail_url) as image,
  category,
  published_at as date,
  author,
  tags
from public.blog_posts;
```

---

## Operational steps (how to switch from mocks to real Supabase)

1. Apply the SQL above in Supabase (Dashboard → SQL Editor).
2. Backfill data (vehicles, tools, locations, blogs/content).
3. Regenerate TypeScript DB types and replace `types/database.types.ts`:
   - Use Supabase CLI `gen types` (or the Supabase dashboard type generator).
4. Update `lib/data/*` fetchers:
   - Remove the hardcoded `if (true)` mock fallbacks.
   - Ensure each fetcher selects from the table/view specified above.
5. Validate pages:
   - Home: hero + fleet previews + reviews/polls/tools/events/faq.
   - Fleet pages: `getVehiclesByType('party-bus'|'limo'|'coach')`.
   - Location city pages: `getLocationBySlug(city_slug)`.

---

## Quick mapping cheatsheet

- `HeroData` → `homepage_hero` (already done)
- `PollData` → `polls` (already done)
- `ReviewsData` → `reviews` + add `tags text[]`
- `ToolData` → `tools` + add `icon_name/modal_content/cta_text/cta_link`
- `EventData` → `events` + add `title/image_key/date_range/category`
- `FaqData` → `faqs` (already includes `click_count`; uses `page_slug`)
- `ContentSectionData` → `content_sections` (already done)
- Locations → `locations` (already done; consider adding `location_states` view)
- `BlogData/PostData` → extend `blog_posts` and optionally add a `blogs` view
- `VehicleData` → create `vehicles` (optionally import from `vehicles11`)
