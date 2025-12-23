# Bus2Ride Implementation Plan

> Updated: December 23, 2025  
> Based on: current codebase (routes, data fetchers, and section components)

---

## Summary

| Category         | Built | Missing | Priority |
| ---------------- | ----- | ------- | -------- |
| Pages (routes)   | 22    | 0       | High     |
| SEO (core)       | 2     | 0       | High     |
| API Integrations | 0     | 2       | Medium   |

Notes:

- SEO metadata routes are implemented via Next.js Metadata Routes: `/robots.txt` and `/sitemap.xml`.
- Remaining work is primarily polish + external API wiring.

---

## 1. Routes Inventory (Current)

All route `page.tsx` files currently present:

| Route                             | File                                          |
| --------------------------------- | --------------------------------------------- |
| `/`                               | `app/page.tsx`                                |
| `/fleet`                          | `app/fleet/page.tsx`                          |
| `/party-buses`                    | `app/party-buses/page.tsx`                    |
| `/limousines`                     | `app/limousines/page.tsx`                     |
| `/coach-buses`                    | `app/coach-buses/page.tsx`                    |
| `/vehicles/[slug]`                | `app/vehicles/[slug]/page.tsx`                |
| `/locations`                      | `app/locations/page.tsx`                      |
| `/locations/[state]`              | `app/locations/[state]/page.tsx`              |
| `/locations/[state]/[fleet_city]` | `app/locations/[state]/[fleet_city]/page.tsx` |
| `/events`                         | `app/events/page.tsx`                         |
| `/events/[slug]`                  | `app/events/[slug]/page.tsx`                  |
| `/pricing`                        | `app/pricing/page.tsx`                        |
| `/polls`                          | `app/polls/page.tsx`                          |
| `/polls/results`                  | `app/polls/results/page.tsx`                  |
| `/blog`                           | `app/blog/page.tsx`                           |
| `/blog/[slug]`                    | `app/blog/[slug]/page.tsx`                    |
| `/tools`                          | `app/tools/page.tsx`                          |
| `/tools/[slug]`                   | `app/tools/[slug]/page.tsx`                   |
| `/faq`                            | `app/faq/page.tsx`                            |
| `/reviews`                        | `app/reviews/page.tsx`                        |
| `/contact`                        | `app/contact/page.tsx`                        |
| `/industry-secrets`               | `app/industry-secrets/page.tsx`               |

---

## 2. SEO (Implemented)

| Endpoint       | File             | Notes                                                                   |
| -------------- | ---------------- | ----------------------------------------------------------------------- |
| `/robots.txt`  | `app/robots.ts`  | Disallows `/_next/` and `/api/`, links sitemap                          |
| `/sitemap.xml` | `app/sitemap.ts` | Includes static + dynamic routes (blog/tools/events/vehicles/locations) |

---

## 3. Remaining Work (Backlog)

High-value next steps:

1. Fleet preview polish (CTA/button quality, thumbnail responsiveness, contrast)
2. Location pages: wire real weather + traffic APIs (keep free-tier friendly)
3. Modal standardization (optionally extract a shared “Tools-style” modal wrapper)
4. Continue design consistency pass (“more blue, less dark”) where desired

---

## Acceptance Criteria

A page is "complete" when:

- [ ] Correct Hero presence (per rules)
- [ ] All page-specific content sections present
- [ ] Correct footer stack order (per README)
- [ ] FAQs are page-contextual
- [ ] Polls follow the 3-column rule
- [ ] Styling matches the blue theme
- [ ] No console errors
- [ ] Mobile responsive

---

_Last updated: December 23, 2025_
