# Bus2Ride

## Overview
Bus2Ride is a platform for renting party buses, limousines, and coach buses. It aims to provide a premium user experience for group transportation rentals, offering a wide array of vehicles and services. The project is built with a focus on performance, rich UI/UX, and extensive content, including interactive elements like polls and trivia, to enhance user engagement and provide valuable information. It targets a broad market looking for reliable and luxurious group travel solutions.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application uses Next.js 16 with the App Router, leveraging Server Components by default and Client Components for interactive elements. Key patterns include file-based routing, a structured component library (`layout/`, `sections/`, `ui/`), and styling with Tailwind CSS and a custom "Midnight Pulse" design system. The design system incorporates a dark theme, custom utility classes for glassmorphism, neon effects, and holographic gradients, along with extensive animations for a dynamic user interface.

### Data Layer
All data fetching from Supabase is managed through typed fetcher functions located in `lib/data/` to ensure consistency, enable mock fallbacks, and centralize error handling. A new Supabase client is created per request to ensure compatibility with Next.js Fluid compute.

### Page Structure
Most pages adhere to a consistent section stack: Hero, primary content, reviews, polls grid, tools grid, events grid, and FAQ. Pages feature enhanced premium structures, including gradient heroes, premium section dividers, facts showcases, trivia carousels, and content expansion blocks for SEO. Each vehicle/page type has a distinct color theme.

### Performance Optimization
The application employs ISR with a `revalidate: 300` strategy and edge caching. The polls page is highly optimized with zero server-side poll fetching, client-side data loading on user interaction, and static stats headers to avoid expensive queries.

### Content Enhancement Components
Key reusable components include:
- **TriviaCarousel**: Interactive trivia cards with flip animations.
- **FactsShowcase**: Grid display of key statistics with animated entrance effects.
- **ContentExpansion**: Expandable content blocks for long articles, enhancing SEO and UX.
- **LinkConstellation**: Organized internal and external link modules for SEO.
- **ComingSoonPlaceholder**: Graceful placeholders for upcoming features.

### Polls Page Architecture
Designed for efficiency with 51k+ polls, featuring:
- **PollStatsDashboard**: Displays 24 real-time metrics with clickable navigation.
- **LiveStatsBar**: Horizontal scrolling stats bar with 14+ clickable stat cards showing live activity (votes in 5min/60min/today, trending category, rising polls, hidden gems, hardest/easiest polls). Located at top of both /polls and /polls/results pages.
- **PollFilterTabs**: Filter tabs for browsing polls by: Popular, Trending, Rising, New, Today's Hot, Hardest, Easiest, Hidden Gems, Random.
- **Poll Analytics API**: `/api/polls/analytics` route for filtered poll queries with server-side caching.
- **Category Recommendations System**: Smart category mappings for relevant suggestions.
- **Poll Components**: `PollCard`, `PollCategoryHeader`, `RelatedPollsSection`, `PollsLoadMore` for efficient handling.
- **Embed Feature**: Allows embedding polls via iframe.
- **API Routes**: `/api/polls` for paginated and filtered poll fetching.

### UI/UX Enhancements
- **Poll Modal Redesign**: Two-column layout, themed gradients, integrated embed code generation, and share functionality.
- **Hot Results Section**: Features a prominent "Hot Results" badge and statistics showcase on the polls results page.
- **Fleet Features Components**: `FeatureGrid`, `SpecsPanel`, `BestForTags`, and `CTABand` for detailed vehicle presentation with theme-aware gradients. All three fleet pages use consistent components:
  - Party Buses: pink-to-purple gradient
  - Limousines: amber-to-yellow gradient
  - Coach Buses: emerald-to-teal gradient
- **Polls Page Hierarchy**: Categories shown first, then locations with 12-state initial limit and "See All States" expansion button.
- **TriviaCarousel**: Fully interactive with click-to-flip cards, arrow navigation (prev/next buttons), dot indicators, and 8-second auto-play.

## External Dependencies

-   **Supabase (PostgreSQL)**: The primary backend for data storage, including vehicles, reviews, polls, tools, events, FAQs, locations, and blog posts. Utilizes Supabase Storage for vehicle images and Supabase Auth for cookie-based authentication.
-   **OpenAI**: The `openai` package is installed, indicating potential use for AI-powered features.
-   **OpenWeatherMap**: Configured for weather icon loading, suggesting integration for location-based weather information.