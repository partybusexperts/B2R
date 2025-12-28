# Copilot Instructions for Bus2Ride

Party bus / limo / coach rental platform. **Next.js 16 (App Router)**, **Tailwind**, **shadcn/Radix**, **Supabase**.

## Architecture

### Server-First Pattern

- Default to **Server Components**. Use `"use client"` only for interactive islands (search, filters, carousels).
- Client components: [fleet-list.tsx](../components/sections/fleet-list.tsx), [reviews-section.tsx](../components/sections/reviews-section.tsx)

### Data Layer (`lib/data/`)

**NEVER fetch Supabase directly in pages.** Use typed fetchers that handle mock fallbacks:

```tsx
// ✅ Correct - in page.tsx
const vehicles = await getRandomVehicles();
const reviews = await getReviews(6);

// ❌ Wrong - never do this in pages
const { data } = await supabase.from("vehicles").select("*");
```

Key fetchers: `getVehicles`, `getRandomVehicles`, `getReviews`, `getLocationBySlug`, `getHeroBySlug`, `getTools`, `getContentBySlug`

### Supabase Client

**CRITICAL:** Always create fresh client per request in [lib/supabase/server.ts](../lib/supabase/server.ts):

```tsx
const supabase = await createClient(); // ✅ Inside function
```

Never cache or store client globally (breaks with Next.js Fluid compute).

## Page Structure

### Standard Footer Stack

Usually pages end with an order similar to this:

```tsx
<ReviewsSection reviews={reviews} />
<PollsGrid category="party-bus" />     {/* Contextual */}
<ToolsGrid category="pricing" />       {/* Contextual */}
<EventsGrid />
<FaqSection category="party-bus" />    {/* Contextual */}
```

See [app/party-buses/page.tsx](../app/party-buses/page.tsx) for canonical example.

### Hero Rules

- **Include:** Homepage, vehicle pages, location pages, events, blog
- **Exclude:** Fleet listings (`/party-buses`, `/limousines`), `/polls`, `/poll-results`

```tsx
import Hero from "@/components/layout/hero";
<Hero slug="home" />; // slug matches Supabase `homepage_hero` row
```

### Vehicle Types

Three types throughout codebase: `"party-bus" | "limo" | "coach"` (defined in [types/vehicle.types.ts](../types/vehicle.types.ts))

## Key Components

| Component            | Location                                                                                        | Purpose                                    |
| -------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `FleetList`          | [components/sections/fleet-list.tsx](../components/sections/fleet-list.tsx)                     | Main inventory with search/filter (client) |
| `FleetPreviewServer` | [components/sections/fleet-preview.server.tsx](../components/sections/fleet-preview.server.tsx) | Cross-sell carousel (server)               |
| `ContentFeatures`    | [components/sections/content-features.tsx](../components/sections/content-features.tsx)         | "Why X Rocks" feature grids                |
| `ReviewsSection`     | [components/sections/reviews-section.tsx](../components/sections/reviews-section.tsx)           | Reviews with tag filtering (client)        |
| `LocationInfoGrid`   | [components/sections/location-info-grid.tsx](../components/sections/location-info-grid.tsx)     | Modal grid for location data               |

## Location Pages Pattern

City pages (`app/locations/state/[state_slug]/city/[city_slug]/page.tsx`) require:

```tsx
<Hero slug={city_slug} />
<LiveConditions city={location.name} lat={...} lng={...} />
<LocationInfoGrid items={location.local_events} />
<ContentFeatures slug={`sample-night-${city_slug}`} />
<LocationTrivia trivia={location.trivia} />
<FleetList vehicles={fleet} />
{/* Standard Footer Stack */}
```

## Styling

- **Primary:** Blue `#2563eb`
- **Icons:** `lucide-react` only
- **Images:** Use `toPublicStorageUrl("vehicles1", key)` from [lib/helpers/storage.ts](../lib/helpers/storage.ts)

## Commands

```bash
npm run dev      # Dev server
npm run lint     # Run before committing
npm run build    # Production build
```

## File Conventions

- Types: `types/*.types.ts` - Keep `database.types.ts` synced with Supabase
- Data fetchers: `lib/data/*.ts` - One file per entity
- Sections: `components/sections/*.tsx` - Reusable page blocks
