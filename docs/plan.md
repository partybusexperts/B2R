# Bus2Ride Implementation Plan

> Generated: December 11, 2025  
> Based on: `docs/requirements.md`, `README.md`, current codebase analysis

---

## Summary

| Category         | Built | Missing | Priority |
| ---------------- | ----- | ------- | -------- |
| Pages            | 7     | 13      | High     |
| Components       | 18    | 6       | Medium   |
| Features         | 12    | 15      | High     |
| API Integrations | 0     | 3       | Medium   |

---

## 1. PAGES — Current State vs Required

### ✅ Built Pages (7)

| Page                | Route                                                         | Status      | Notes                                                          |
| ------------------- | ------------------------------------------------------------- | ----------- | -------------------------------------------------------------- |
| Homepage            | `/`                                                           | ✅ Complete | Has Hero, Fleet Previews, Reviews, Polls, Tools, Events, FAQ   |
| Party Buses Fleet   | `/party-buses`                                                | ✅ Partial  | Missing: search bar, filters, arrows removed ✓                 |
| Individual Vehicle  | `/vehicles/[slug]`                                            | ✅ Partial  | Missing: larger fonts, more blue, remove spec sheet            |
| Locations Directory | `/locations`                                                  | ✅ Basic    | Needs stack: Polls → Fleet → Tools → Reviews → FAQ             |
| City Location       | `/locations/state/[state_slug]/city/[city_slug]`              | ✅ Partial  | Has Hero, LiveConditions, Trivia; needs fixes per requirements |
| State Location      | `/locations/state/[state_slug]`                               | ⚠️ Stub     | Needs same template as city                                    |
| City Fleet          | `/locations/state/[state_slug]/city/[city_slug]/[fleet_slug]` | ⚠️ Stub     | Needs 3 variants: party-buses, limousines, coach-buses         |

### ❌ Missing Pages (13)

| Page                 | Route               | Priority  | Requirements Summary                                                   |
| -------------------- | ------------------- | --------- | ---------------------------------------------------------------------- |
| Limousines Fleet     | `/limousines`       | 🔴 High   | Copy `/party-buses` structure, change type filter                      |
| Coach Buses Fleet    | `/coach-buses`      | 🔴 High   | Copy `/party-buses` structure, change type filter                      |
| Events Page          | `/events`           | 🔴 High   | Hero + grid styling (boxes not rectangles) + standard stack            |
| Individual Event     | `/events/[slug]`    | 🟡 Medium | Remove filler, reorder content, show related events                    |
| Pricing Page         | `/pricing`          | 🔴 High   | Hero + search/filters + Reviews → Polls → Fleet → Tools → FAQ → Events |
| Polls Page           | `/polls`            | 🔴 High   | No Hero, faster voting UX, standard stack                              |
| Poll Results         | `/poll-results`     | 🟡 Medium | No Hero, "Cool Stats" section, category grid                           |
| Blog Page            | `/blog`             | 🟡 Medium | Hero, fix images, search/filters, clickable amenity tags               |
| Individual Blog Post | `/blog/[slug]`      | 🟡 Medium | Contextual Hero, proper title, remove irrelevant widgets               |
| Tools Page           | `/tools`            | 🟡 Medium | Hero, remove "Launch ready charter ops stack", fix circle icons        |
| FAQ Page             | `/faq`              | 🟡 Medium | Hero, more blue/less dark, "Most Clicked" section                      |
| Industry Secrets     | `/industry-secrets` | 🟢 Low    | Hero, standardized boxes, Tools-style modals                           |
| Reviews Page         | `/reviews`          | 🟡 Medium | Hero, more blue styling                                                |
| Contact Page         | `/contact`          | 🟡 Medium | Hero, high-contrast form, trivia/facts, "How to Book"                  |

---

## 2. COMPONENTS — Gap Analysis

### ✅ Built Components (18)

| Component           | File                                          | Status                                   |
| ------------------- | --------------------------------------------- | ---------------------------------------- |
| Hero                | `components/layout/hero.tsx`                  | ✅ Working                               |
| Fleet Preview       | `components/sections/fleet-preview.tsx`       | ⚠️ Needs fixes (see below)               |
| Fleet List          | `components/sections/fleet-list.tsx`          | ⚠️ Missing search/filters                |
| Reviews Section     | `components/sections/reviews-section.tsx`     | ✅ Has search + filters                  |
| Polls Grid          | `components/sections/polls-grid.tsx`          | ✅ 3-column layout                       |
| Poll Card           | `components/sections/poll-card.tsx`           | ✅ Working                               |
| Tools Grid          | `components/sections/tools-grid.tsx`          | ✅ Context rotation                      |
| Tool Card           | `components/sections/tool-card.tsx`           | ✅ Has modal                             |
| Events Grid         | `components/sections/events-grid.tsx`         | ✅ 6 events, randomized                  |
| Events Card         | `components/sections/events-card.tsx`         | ⚠️ Change "Related Polls" → "Live Quote" |
| FAQ Section         | `components/sections/faq-section.tsx`         | ✅ "See more" expansion                  |
| Content Section     | `components/sections/content-section.tsx`     | ✅ Working                               |
| Content Features    | `components/sections/content-features.tsx`    | ✅ Working                               |
| Live Conditions     | `components/sections/live-conditions.tsx`     | ⚠️ Needs real APIs                       |
| Location Trivia     | `components/sections/location-trivia.tsx`     | ⚠️ Needs "spicy" redesign                |
| Location Info Grid  | `components/sections/location-info-grid.tsx`  | ⚠️ Needs modal styling                   |
| Vehicle Detail      | `components/sections/vehicle-detail.tsx`      | ⚠️ Remove spec sheet, larger fonts       |
| Locations Directory | `components/sections/locations-directory.tsx` | ✅ Basic                                 |

### ❌ Missing Components (6)

| Component        | Purpose                                                            | Priority  |
| ---------------- | ------------------------------------------------------------------ | --------- |
| SearchFilterBar  | Reusable search + checkbox filters for Fleet, Reviews, Blog, etc.  | 🔴 High   |
| PollResultsGrid  | Browse poll results by category with stats                         | 🟡 Medium |
| BlogCard         | Blog post card with clickable amenity tags                         | 🟡 Medium |
| CoolStatsSection | "Most popular poll", facts display for Poll Results page           | 🟡 Medium |
| BookingProcess   | "How the Bus2Ride Booking Process Works" (reusable)                | 🔴 High   |
| ModalStandard    | Tools-style modal for use site-wide (Why X Rocks, Location modals) | 🔴 High   |

---

## 3. COMPONENT FIXES NEEDED

### Fleet Preview (`fleet-preview.tsx`)

- [ ] Add "Learn More" button in bottom-right of main photo
- [ ] Fix pixelated buttons (match hero quality)
- [ ] Increase contrast for "Chauffeur Included" badge
- [ ] Fix thumbnail click stall (instant update)
- [ ] Homepage: add left/right arrows (click anywhere → fleet page)

### Events Card (`events-card.tsx`)

- [ ] Change "Related Polls" button → "Live Quote"

### Location Trivia (`location-trivia.tsx`)

- [ ] Bigger font
- [ ] More items
- [ ] Better organization
- [ ] More "spicy" content

### Location Info Grid (`location-info-grid.tsx`)

- [ ] Convert to modal popups (match Tools modal style)
- [ ] Square boxes, not rectangles

### Vehicle Detail (`vehicle-detail.tsx`)

- [ ] Remove spec sheet
- [ ] Larger fonts
- [ ] More blue styling

### Live Conditions (`live-conditions.tsx`)

- [ ] Expand section size
- [ ] Connect real weather API
- [ ] Connect real traffic API

---

## 4. API INTEGRATIONS NEEDED

| API                  | Purpose                         | Free Tier       | Priority  |
| -------------------- | ------------------------------- | --------------- | --------- |
| OpenWeatherMap       | Live weather for location pages | ✅ Yes          | 🔴 High   |
| Google Maps / TomTom | Live traffic for location pages | ⚠️ Limited      | 🟡 Medium |
| Additional feeds     | TBD per requirements            | Prioritize free | 🟢 Low    |

---

## 5. STYLING FIXES (Global)

- [ ] **More blue, less dark** — FAQ page, Reviews page, Industry Secrets
- [ ] **Larger fonts** — City location pages, Individual vehicle pages
- [ ] **Modal standardization** — Use Tools modal style everywhere
- [ ] **Button quality** — Fix pixelated buttons in Fleet sections

---

## 6. IMPLEMENTATION ORDER

### Phase 1: Core Pages (Week 1)

1. Create `/limousines` and `/coach-buses` (copy from `/party-buses`)
2. Create `/events` page with standard stack
3. Create `/pricing` page with search/filters
4. Create `/polls` page (no hero, faster UX)
5. Fix Fleet Preview component issues

### Phase 2: Secondary Pages (Week 2)

6. Create `/tools` page
7. Create `/faq` page
8. Create `/reviews` page
9. Create `/contact` page
10. Create `/blog` page + `/blog/[slug]`

### Phase 3: Advanced Features (Week 3)

11. Create `/poll-results` page with stats
12. Create `/industry-secrets` page
13. Integrate weather API (OpenWeatherMap)
14. Integrate traffic API
15. Create `/events/[slug]` individual event pages

### Phase 4: Polish (Week 4)

16. City location page fixes (modals, trivia, fonts)
17. State location template (copy city)
18. City fleet pages (`/locations/state/[state_slug]/city/[city_slug]/party-buses`, etc.)
19. Styling consistency pass (blue theme, fonts)
20. Modal standardization pass

---

## 7. QUICK WINS (Can Do Now)

These require minimal effort:

1. **Create `/limousines/page.tsx`** — Copy `/party-buses/page.tsx`, change type to "limo"
2. **Create `/coach-buses/page.tsx`** — Copy `/party-buses/page.tsx`, change type to "coach"
3. **Change "Related Polls" → "Live Quote"** in `events-card.tsx`
4. **Remove spec sheet** from `vehicle-detail.tsx`
5. **Update locations directory stack** — Add missing sections

---

## 8. DATA/SUPABASE TASKS

| Table              | Status     | Needs                                                                     |
| ------------------ | ---------- | ------------------------------------------------------------------------- |
| `heroes1`          | ✅ Exists  | Add slugs for: events, pricing, polls, blog, tools, faq, reviews, contact |
| `vehicles11`       | ✅ Exists  | Working                                                                   |
| `reviews`          | ✅ Exists  | Add `tags` column for filtering                                           |
| `polls1`           | ✅ Exists  | Working                                                                   |
| `tools`            | ✅ Exists  | Add more entries                                                          |
| `events`           | ✅ Exists  | Working                                                                   |
| `faqs`             | ✅ Exists  | Add page-specific entries                                                 |
| `content_sections` | ✅ Exists  | Add: booking-process, why-x-rocks variants                                |
| `blog_posts`       | ⚠️ Partial | Fix image storage paths                                                   |

---

## 9. FILES TO CREATE

```
app/
├── limousines/
│   └── page.tsx                    # Copy from party-buses
├── coach-buses/
│   └── page.tsx                    # Copy from party-buses
├── events/
│   ├── page.tsx                    # Events listing
│   └── [slug]/
│       └── page.tsx                # Individual event
├── pricing/
│   └── page.tsx                    # Pricing page
├── polls/
│   └── page.tsx                    # Polls listing
├── poll-results/
│   └── page.tsx                    # Poll results browser
├── blog/
│   ├── page.tsx                    # Blog listing
│   └── [slug]/
│       └── page.tsx                # Individual post
├── tools/
│   └── page.tsx                    # Tools listing
├── faq/
│   └── page.tsx                    # FAQ page
├── reviews/
│   └── page.tsx                    # Reviews page
├── contact/
│   └── page.tsx                    # Contact form
└── industry-secrets/
    └── page.tsx                    # Industry secrets

components/sections/
├── search-filter-bar.tsx           # Reusable search + filters
├── poll-results-grid.tsx           # Poll results browser
├── blog-card.tsx                   # Blog post card
├── cool-stats-section.tsx          # Stats display
└── modal-standard.tsx              # Standardized modal
```

---

## 10. ACCEPTANCE CRITERIA

A page is "complete" when:

- [ ] Correct Hero presence (per rules)
- [ ] All page-specific content sections present
- [ ] Correct footer stack order (per README)
- [ ] FAQs are page-contextual
- [ ] Polls follow 3-column rule
- [ ] Styling matches blue theme
- [ ] No console errors
- [ ] Mobile responsive

---

_Last updated: December 11, 2025_
