export type HeroFallback = {
  page_slug: string;
  title?: string;
  subtitle?: string;
  primary_cta?: { label: string; href: string };
  secondary_cta?: { label: string; href: string };
  tertiary_cta?: { label: string; href: string };
  phone_display?: string;
  phone_tel?: string;
  email?: string;
  gradient_from?: string;
  gradient_via?: string;
  gradient_to?: string;
  text_color?: string;
  wave_fill?: string;
  autoplay_ms?: number;
  images?: string[];
};

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "").replace(/\/+$/, "");
const BLOG_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BLOG_BUCKET || "Blog";
const buildBlogImageUrl = (filename: string) => {
  if (SUPABASE_URL) {
    const encoded = filename
      .split("/")
      .map((segment) => encodeURIComponent(segment))
      .join("/");
    return `${SUPABASE_URL}/storage/v1/object/public/${BLOG_BUCKET}/${encoded}`;
  }
  return `/images/blog/${filename}`;
};

const HERO_FALLBACKS = {
  home: {
    page_slug: "home",
    title: "Nationwide Party Bus Rentals",
    subtitle: "Instant quotes, curated vehicles, and 24/7 dispatch support in 350+ cities.",
    primary_cta: { label: "Get Instant Quote", href: "/quote#instant" },
    secondary_cta: { label: "See Vehicles", href: "/fleet" },
    tertiary_cta: { label: "Call (888) 535-2566", href: "tel:8885352566" },
    gradient_from: "from-blue-950",
    gradient_via: "via-blue-900",
    gradient_to: "to-slate-900",
    text_color: "text-white",
    wave_fill: "#122a56",
    autoplay_ms: 6200,
    images: [
      "/images/party-buses/36 Passenger Party Bus Interior Lux.png",
      "/images/party-buses/45 Passenger Party Bus Exterior Lux.png",
      "/images/coach-buses/56 Passenger Coach Bus Interior Lux.png",
      "/images/executive-sprinters/14 Passenger Executive Sprinter Interior Lux.png",
    ],
  },
  events: {
    page_slug: "events",
    title: "Events & Occasions",
    subtitle:
      "Explore popular event types—weddings, proms, concerts, game days & more—then jump straight to the one you need.",
    primary_cta: { label: "Instant Quote", href: "/quote#instant" },
    secondary_cta: { label: "View Fleet", href: "/fleet" },
    tertiary_cta: { label: "Call (888) 535-2566", href: "tel:8885352566" },
    gradient_from: "from-sky-400",
    gradient_via: "via-blue-600",
    gradient_to: "to-indigo-900",
    text_color: "text-white",
    wave_fill: "#122a56",
    autoplay_ms: 5400,
    images: [
      "/images/events/weddings.jpg",
      "/images/events/prom.jpg",
      "/images/events/concerts.jpg",
      "/images/events/sporting events.jpg",
    ],
  },
  polls: {
    page_slug: "polls",
    title: "Community Polls Hub",
    subtitle: "Vote fast. See results instantly. Embed any poll on your site in one click.",
    primary_cta: { label: "Browse Polls", href: "/polls" },
    secondary_cta: { label: "View Results", href: "/poll-results" },
    tertiary_cta: { label: "Contact Us", href: "mailto:info@bus2ride.com" },
    gradient_from: "from-purple-900",
    gradient_via: "via-indigo-800",
    gradient_to: "to-blue-900",
    text_color: "text-white",
    wave_fill: "#0f1f46",
    autoplay_ms: 5600,
    images: [
      "/images/blog/multi stop night out.jpg",
      "/images/events/girls nights out.jpg",
      "/images/events/bachelor parties.jpg",
    ],
  },
  pricing: {
    page_slug: "pricing",
    title: "Transparent Pricing",
    subtitle: "No hidden fees. Real quotes in minutes.",
    primary_cta: { label: "Instant Quote", href: "/quote#instant" },
    secondary_cta: { label: "See Sample Rates", href: "/pricing" },
    tertiary_cta: { label: "Call Dispatch", href: "tel:8885352566" },
    gradient_from: "from-blue-950",
    gradient_via: "via-blue-900",
    gradient_to: "to-black",
    text_color: "text-white",
    wave_fill: "#122a56",
    autoplay_ms: 5800,
    images: [
      "/images/shuttle-buses/30 Passenger Shuttle Bus Interior Lux.png",
      "/images/coach-buses/52 Passenger Coach Bus Exterior Lux.png",
      "/images/party-buses/32 Passenger Party Bus Interior Lux.png",
    ],
  },
  tools: {
    page_slug: "tools",
    title: "Tools & Calculators",
    subtitle: "Plan smarter. Save money. Pick the perfect ride—fast.",
    primary_cta: { label: "Get Instant Quote", href: "/quote" },
    secondary_cta: { label: "View Fleet", href: "/fleet" },
    tertiary_cta: { label: "Contact Us", href: "mailto:info@bus2ride.com" },
    gradient_from: "from-sky-400",
    gradient_via: "via-blue-600",
    gradient_to: "to-indigo-900",
    text_color: "text-white",
    wave_fill: "#122a56",
    autoplay_ms: 5200,
    images: [
      "/images/executive-sprinters/10 Passenger Executive Sprinter Interior Lux.png",
      "/images/sprinter-limo-style/14 Passenger Limo Style Sprinter Interior Lux.png",
      "/images/party-buses/24 Passenger Party Bus Interior Lux.png",
    ],
  },
  contact: {
    page_slug: "contact",
    title: "Contact Us",
    subtitle: "Fast quotes, real humans, zero spam. Call, email, or use the form below.",
    phone_display: "(888) 535-2566",
    phone_tel: "8885352566",
    email: "info@bus2ride.com",
    primary_cta: { label: "Get Instant Quote", href: "/quote#instant" },
    secondary_cta: { label: "View Fleet", href: "/fleet" },
    tertiary_cta: { label: "Email Us", href: "mailto:info@bus2ride.com" },
    gradient_from: "from-sky-400",
    gradient_via: "via-blue-600",
    gradient_to: "to-indigo-900",
    text_color: "text-white",
    wave_fill: "#122a56",
    autoplay_ms: 5200,
    images: [
      "/images/party-buses/16 Passenger Party Bus Interior Lux.png",
      "/images/executive-sprinters/12 Passenger Executive Sprinter Interior Lux.png",
      "/images/limousines/18 Passenger Escalade Limo Interior Lux.png",
    ],
  },
  blog: {
    page_slug: "blog",
    title: "Blog & Insights",
    subtitle:
      "Guides, checklists, and insider tips for renting party buses, limos, shuttles, and black cars—plan with confidence.",
    primary_cta: { label: "Instant Live Quote", href: "/quote#instant" },
    secondary_cta: { label: "Email Us", href: "mailto:info@bus2ride.com" },
    tertiary_cta: { label: "Call (888) 535-2566", href: "tel:8885352566" },
    gradient_from: "from-sky-400",
    gradient_via: "via-blue-600",
    gradient_to: "to-indigo-900",
    text_color: "text-white",
    wave_fill: "#0b1934",
    autoplay_ms: 6000,
    images: [
      buildBlogImageUrl("How Many Fit.jpg"),
      buildBlogImageUrl("wedding shuttle.jpg"),
      buildBlogImageUrl("pricing.jpg"),
    ],
  },
  fleet: {
    page_slug: "fleet",
    title: "Browse Vehicle Types",
    subtitle: "From sleek limos to mega party buses — every ride is clean, comfy, and ready to roll.",
    primary_cta: { label: "Get an Instant Quote", href: "/quote#instant" },
    secondary_cta: { label: "Call Dispatch", href: "tel:8885352566" },
    tertiary_cta: { label: "Explore Fleet", href: "/fleet" },
    gradient_from: "from-blue-950",
    gradient_via: "via-blue-900",
    gradient_to: "to-black",
    text_color: "text-white",
    wave_fill: "#122a56",
    autoplay_ms: 5600,
    images: [
      "/images/party-buses/30 Passenger Party Bus Exterior Lux.png",
      "/images/limousines/18 Passenger Escalade Limo Interior Lux.png",
      "/images/shuttle-buses/36 Passenger Shuttle Bus Interior Lux.png",
    ],
  },
  reviews: {
    page_slug: "reviews",
    title: "Customer Reviews",
    subtitle:
      "See what real customers say about their Bus2Ride experience. We pride ourselves on top-notch service, clean vehicles, and unforgettable events.",
    primary_cta: { label: "Get Instant Quote", href: "/quote#instant" },
    secondary_cta: { label: "View Fleet", href: "/fleet" },
    tertiary_cta: { label: "Contact Us", href: "mailto:info@bus2ride.com" },
    gradient_from: "from-blue-900/80",
    gradient_via: "via-blue-950/80",
    gradient_to: "to-black/90",
    text_color: "text-white",
    wave_fill: "#0b1934",
    autoplay_ms: 6000,
    images: [
      "/images/events/corporate parties.jpg",
      "/images/events/dinners out.jpg",
      "/images/events/anniveraries parties.jpg",
    ],
  },
  locations: {
    page_slug: "locations",
    title: "Nationwide Coverage",
    subtitle: "We serve cities and towns across the U.S.—use the search or browse to find service in your area.",
    primary_cta: { label: "Instant Quote", href: "/quote#instant" },
    secondary_cta: { label: "View Fleet", href: "/fleet" },
    tertiary_cta: { label: "Call Dispatch", href: "tel:8885352566" },
    gradient_from: "from-sky-400",
    gradient_via: "via-blue-600",
    gradient_to: "to-indigo-900",
    text_color: "text-white",
    wave_fill: "#122a56",
    autoplay_ms: 5200,
    images: [
      "/images/shuttle-buses/40 Passenger Shuttle Bus Exterior Lux.png",
      "/images/coach-buses/54 Passenger Coach Bus Exterior Lux.png",
      "/images/party-buses/32 Passenger Party Bus Exterior Lux.png",
    ],
  },
  "industry-secrets": {
    page_slug: "industry-secrets",
    title: "Limo & Party Bus — Industry Secrets",
    subtitle:
      "Insider tips operators don't always advertise—book smarter, avoid surprise fees, and get the most out of your ride.",
    primary_cta: { label: "See Pricing", href: "/pricing" },
    secondary_cta: { label: "Ask About Off-Peak", href: "/contact" },
    tertiary_cta: { label: "Explore Fleet", href: "/fleet" },
    gradient_from: "from-sky-400",
    gradient_via: "via-blue-600",
    gradient_to: "to-indigo-900",
    text_color: "text-white",
    wave_fill: "#122a56",
    autoplay_ms: 5600,
    images: [
      "/images/events/brewery tours.jpg",
      "/images/events/corporate parties.jpg",
      "/images/party-buses/28 Passenger Party Bus Interior Lux.png",
    ],
  },
  "events/haunted-house-tours": {
    page_slug: "events/haunted-house-tours",
    title: "Haunted House Tours",
    subtitle: "Skip parking, arrive together, and hit multiple haunts in one night—zero stress, all screams.",
    primary_cta: { label: "Instant Quote", href: "/quote#instant" },
    secondary_cta: { label: "View Fleet", href: "/fleet" },
    tertiary_cta: { label: "Call Dispatch", href: "tel:8885352566" },
    gradient_from: "from-sky-400",
    gradient_via: "via-blue-600",
    gradient_to: "to-indigo-900",
    text_color: "text-white",
    wave_fill: "#122a56",
    autoplay_ms: 5400,
    images: [
      "/images/events/haunted houses.jpg",
      "/images/events/girls nights out.jpg",
      "/images/events/new years eve.jpg",
    ],
  },
} satisfies Record<string, HeroFallback>;

export type HeroFallbackKey = keyof typeof HERO_FALLBACKS;

export function getHeroFallback(key: HeroFallbackKey | string, overrides: Partial<HeroFallback> = {}): HeroFallback {
  const base = HERO_FALLBACKS[key as HeroFallbackKey] ?? { page_slug: String(key) };
  return {
    ...base,
    ...overrides,
    page_slug: overrides.page_slug ?? base.page_slug ?? String(key),
  };
}
