"use client";
import React from "react";
import Link from "next/link";

type Secret = {
  id: string;
  title: string;
  teaser: string;
  details: string;
  tag?: string;
};

const INDUSTRY_SECRETS: Secret[] = [
  { id: "offpeak-pricing", title: "Off-Peak = Real Savings", teaser: "Sun–Thu and daytime slots can be 10–30% cheaper than Saturdays.", details: "Most fleets stack demand on Saturdays, especially 4–10pm. If your event can swing Sun–Thu or a midday window, operators will often discount to keep vehicles moving. Ask for off-peak pricing or flexible timing to unlock the best rates.", tag: "Pricing" },
  { id: "garage-to-garage", title: "Billing Starts ‘Garage to Garage’", teaser: "Clock usually starts before pickup and ends after drop-off.", details: "Many quotes include travel time from the operator’s base (garage) to your first pickup and back to base at the end. Plan routes and pickup points to minimize this deadhead or choose an operator whose base is close to you.", tag: "Billing" },
  { id: "minimum-hours", title: "Minimum Hour Rules", teaser: "Common minimums: 3–5 hours (higher on Saturdays & prom season).", details: "Even if you only need 90 minutes, you might pay the minimum hourly block. Some operators offer split runs (two short blocks) on slower days—ask if a split transfer is available instead of a continuous charter.", tag: "Booking" },
  { id: "split-transfer", title: "Split Transfer vs. Charter", teaser: "Two short rides can beat one long continuous booking.", details: "For weddings and galas, a transfer to the venue and a later return transfer may be cheaper than holding the vehicle on standby. You’ll give up between-time access to the vehicle, but you’ll often save hundreds.", tag: "Booking" },
  { id: "prom-blackouts", title: "Prom & Homecoming Blackouts", teaser: "Rates spike and rules tighten in school dance season.", details: "Expect higher minimums, stricter contracts, and no alcohol policies (even for 21+ chaperones) during prom/homecoming windows. If you can celebrate the week before or after, you’ll get better availability and pricing.", tag: "Seasonal" },
  { id: "real-photos", title: "Insist on Real Vehicle Photos", teaser: "Stock photos hide age, layout, and wear.", details: "Brokers and some sites use generic images. Ask for recent exterior + interior photos or a short video of the exact vehicle and its seating. This catches warning signs like worn seating, dim lighting, or tight aisle space.", tag: "Quality" },
  { id: "broker-vs-operator", title: "Broker vs. Direct Operator", teaser: "Brokers help compare, but direct operators control dispatch.", details: "Brokers are great for shopping, but the operator is who maintains, insures, and dispatches the vehicle. Before you book, ask for the operating company’s name, DOT/MC numbers, and insurance. Verify who shows up on event day.", tag: "Vendors" },
  { id: "gratuity", title: "Gratuity: Included or Not?", teaser: "Automatic 15–20% service fees are common—verify what’s included.", details: "Quotes may show ‘service fee’ or ‘gratuity’ as separate lines. Clarify whether driver tip is included, optional, or expected at the end. This avoids awkward moments at drop-off and helps you compare apples to apples.", tag: "Billing" },
  { id: "cleanup-fees", title: "Clean-Up & Damage Fees", teaser: "Glitter, confetti, or spills can trigger $100–$500+ fees.", details: "Ask for the cleaning/damage schedule up front. Simple steps—bringing trash bags, avoiding glitter, and assigning one ‘tidy captain’—can save you from surprise fees. Some operators provide liners upon request.", tag: "Fees" },
  { id: "overtime-rounding", title: "Overtime Rounds Up", teaser: "Many companies round to the next 30 or 60 minutes.", details: "If you’re cutting it close, add a planned 30-minute buffer vs. risking rounded overtime. Confirm the increment (15/30/60 minutes) and the rate (overtime can be higher than the base hourly).", tag: "Billing" },
  { id: "traffic-buffer", title: "Event-Day Traffic Buffer", teaser: "Stadiums/arenas can double travel time—pad 30–60 minutes.", details: "Big games and concerts cause lane closures and staging delays. Ask the operator for recommended staging areas and a realistic timeline; leaving 30–60 minutes early is the cheapest insurance against missed doors or curfews.", tag: "Routing" },
  { id: "stadium-permits", title: "Stadium & Venue Permits", teaser: "Some venues require bus/limo permits or staging fees.", details: "Check the venue’s group transportation rules—there may be designated lots, staging lanes, or specific windows for pickup/drop. Your operator may handle this, but you’ll want to know about any extra charges.", tag: "Venues" },
  { id: "wifi-power", title: "Wi-Fi & Power on Coaches", teaser: "Ask if Wi-Fi and outlets are active and included.", details: "Corporate coaches often have Wi-Fi and 110V/USB power—but not always enabled or included. If your team plans to work, confirm bandwidth limits, coverage reliability, and any add-on fees before you book.", tag: "Features" },
  { id: "alcohol-laws", title: "Alcohol Rules Vary by State", teaser: "21+ is required, and some states need a permit.", details: "Policies differ on BYOB, glass bottles, and coolers. Some operators provide ice/trash, others require you to bring your own. Ask for the alcohol policy in writing to avoid last-minute surprises at pickup.", tag: "Policy" },
  { id: "music-setup", title: "Music: Bluetooth Isn’t Guaranteed", teaser: "Some buses are AUX-only or have finicky Bluetooth.", details: "Bring a backup AUX cable and your playlist downloaded for spotty cell zones. If the DJ setup matters, ask for the exact audio input options on your vehicle (AUX, RCA, Bluetooth, USB).", tag: "Onboard" },
  { id: "luggage-limits", title: "Luggage & Weight Limits", teaser: "Party buses aren’t cargo trucks—space fills fast.", details: "Headcounts often match seating, but luggage can overflow aisles and exits (not allowed). For airport and cruise transfers, consider a coach or a second vehicle for bags. Ask for cubic feet or baggage count guidance.", tag: "Capacity" },
  { id: "restroom-reality", title: "Restrooms on Coaches", teaser: "They’re for emergencies—expect limited capacity and odor rules.", details: "Onboard restrooms are compact and best for short emergencies. Many operators require a dump/clean fee if heavily used. For long trips, plan rest stops every 2–3 hours for comfort and cleanliness.", tag: "Features" },
  { id: "insurance-proof", title: "Ask for Proof of Insurance", teaser: "A proper certificate + DOT/MC numbers protect you.", details: "Reputable operators will provide current insurance certificates and operating authority identifiers. This protects you in the rare event of incidents and signals a professional, compliant fleet.", tag: "Safety" },
  { id: "ada-requests", title: "ADA & Accessibility", teaser: "Lift-equipped vehicles exist, but book early.", details: "If you need a lift, priority seating, or specific door heights, request it early. Not every fleet has ADA vehicles ready every day, especially on Saturdays. Ask for dimensions and load times to plan your schedule.", tag: "Accessibility" },
  { id: "real-dispatch", title: "Day-Of Dispatch Contact", teaser: "Get the driver/dispatcher’s number the day before.", details: "Confirm your lead’s contact info and the vehicle number in advance. If the pickup location changes or you need an extra stop, you’ll save precious minutes coordinating directly with dispatch.", tag: "Operations" },
  { id: "multi-stop-fee", title: "Extra Stops Cost Time", teaser: "Each added stop can affect overtime and routing fees.", details: "Stops look quick on paper, but stairs, greetings, and load time add up. Share your exact stop list early so dispatch can slot realistic timing—and you can avoid overtime rounding surprises.", tag: "Routing" },
  { id: "last-minute-deals", title: "Last-Minute Standby Deals", teaser: "If your date is flexible, ask about standby pricing.", details: "Fleets hate idle vehicles. If you can be flexible on pickup time or accept any of several vehicle types, day-before or week-of discounts are possible—especially Sun–Thu or shoulder seasons.", tag: "Pricing" },
  { id: "deposit-window", title: "Deposits & Refund Windows", teaser: "Refund policies vary widely—know your cutoff dates.", details: "Some operators offer partial refunds up to 14–30 days out; others give credit only. Clarify reschedule rules too—moving your date can be easier than canceling outright if plans change.", tag: "Policy" },
  { id: "smoking-fee", title: "No Smoking Means No Smoking", teaser: "Violations trigger deep-clean fees and can end the trip.", details: "Even vapes can set off smoke detectors or leave residue. Most fleets have zero-tolerance policies. If anyone needs to step out, schedule short fresh-air breaks into your route.", tag: "Policy" },
  { id: "child-seats", title: "Child Seats & Minors", teaser: "Bring your own seats; laws apply on buses too.", details: "If you have young children, confirm whether child restraints are required for your vehicle class in your state. Many operators don’t supply seats—plan to install and remove your own.", tag: "Safety" },
  { id: "winter-readiness", title: "Winter Readiness", teaser: "Cold temps affect batteries, tires, and door seals.", details: "For winter events, ask about cold-weather prep (tire condition, blankets on coaches, door seals). Build extra buffer for warm-up and de-icing time so you don’t eat into your first hour.", tag: "Seasonal" },
  { id: "exact-seating", title: "Seating Numbers Are ‘Max’, Not ‘Comfort’", teaser: "A ‘30-passenger’ bus feels best at ~24–26 with coolers.", details: "Marketing capacity assumes no coolers/bags and close shoulder-to-shoulder seating. If you want dance space, coolers, or extra comfort, size up one class from your headcount.", tag: "Capacity" },
  { id: "tolls-fuel", title: "Tolls, Fuel, Admin Lines", teaser: "Small line items add up fast—ask for an all-in quote.", details: "Request a written estimate that includes base hourly, taxes, fuel surcharges, admin fees, tolls, cleaning, and gratuity. ‘All-in’ quotes make it easy to compare vendors without surprises.", tag: "Fees" },
  { id: "route-preview", title: "Route Preview = Fewer Surprises", teaser: "Share exact addresses and load notes in advance.", details: "Tight cul-de-sacs, low bridges, or hotel overhangs can block larger vehicles. Dispatch can pre-route to safer pickup points and advise if a smaller shuttle should handle last-mile transfers.", tag: "Routing" },
  { id: "contract-names", title: "Contract Names Matter", teaser: "Put the venue and planner on the contact list.", details: "Add your event planner, venue coordinator, and a second on-site contact to the contract. If your phone dies, the driver can still coordinate access, loading, and timing with your team.", tag: "Operations" },
  { id: "photo-time", title: "Photo Stops Take Longer", teaser: "10 minutes becomes 25—plan buffer or pre-choose spots.", details: "Photo ops are great, but bus parking, group staging, and traffic lights add time. Pick a single photogenic spot with easy pull-off and pre-brief the driver so they can stage quickly.", tag: "Events" },
  { id: "icy-drinks", title: "Ask for Ice & Water", teaser: "Some operators include it—many will add it if you ask.", details: "If hydration is important, request ice bins and waters during booking. Even if it isn’t standard, operators often accommodate small comforts that make a big difference for guests.", tag: "Onboard" },
];

function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative z-[101] max-w-lg w-[92%] md:w-[640px] rounded-2xl bg-white shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h3 id="modal-title" className="text-2xl font-bold text-blue-900">
            {title}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-xl px-3 py-1 text-sm font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100"
          >
            Close
          </button>
        </div>
        <div className="mt-3 text-blue-900/90 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function SecretCard({
  secret,
  onOpen,
}: {
  secret: Secret;
  onOpen: (id: string) => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-blue-200 shadow-sm p-5 flex flex-col">
      <div className="text-xs uppercase tracking-wide text-blue-600 font-semibold">
        {secret.tag ?? "Secret"}
      </div>
      <h3 className="mt-1 text-lg font-bold text-blue-900">{secret.title}</h3>
      <p className="mt-2 text-blue-800/90">{secret.teaser}</p>
      <div className="mt-4">
        <button
          onClick={() => onOpen(secret.id)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-700 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Learn more
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function InfoBanner({
  title,
  body,
  ctaText,
  href,
}: {
  title: string;
  body: string;
  ctaText?: string;
  href?: string;
}) {
  return (
    <div className="sm:col-span-2 lg:col-span-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h4 className="text-xl font-bold">{title}</h4>
          <p className="mt-1 opacity-90">{body}</p>
        </div>
        {href && ctaText && (
          <Link
            href={href}
            className="inline-flex items-center justify-center rounded-xl bg-white/10 px-4 py-2 font-semibold hover:bg-white/20"
          >
            {ctaText}
          </Link>
        )}
      </div>
    </div>
  );
}

export default function IndustrySecretsPage(): JSX.Element {
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [q, setQ] = React.useState<string>("");

  const openSecret = (id: string) => setOpenId(id);
  const closeSecret = () => setOpenId(null);

  const filtered = React.useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return INDUSTRY_SECRETS;
    return INDUSTRY_SECRETS.filter((s) => {
      const hay = [s.title, s.teaser, s.details, s.tag || ""]
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [q]);

  const banners = [
    {
      title: "Get an ALL-IN Quote Checklist",
      body:
        "When you price-compare, make sure your quote includes base hourly, taxes, fuel, admin, tolls, cleaning, and gratuity. Apples-to-apples saves you $$$.",
      ctaText: "See Pricing",
      href: "/pricing",
    },
    {
      title: "Prom & Peak Saturdays = Plan Early",
      body:
        "If you can do Sun–Thu or daytime, you’ll unlock better vehicles and lower minimums. Flexibility is your secret weapon.",
      ctaText: "Ask About Off-Peak",
      href: "/contact",
    },
    {
      title: "Not Sure on Size?",
      body:
        "‘30 passenger’ is marketing max. For coolers and dance space, size up one class for comfort.",
      ctaText: "Explore Fleet",
      href: "/party-buses",
    },
  ] as const;

  const gridItems: React.ReactNode[] = [];
  filtered.forEach((secret, i) => {
    gridItems.push(
      <SecretCard key={secret.id} secret={secret} onOpen={openSecret} />
    );
    const isBreakpoint = (i + 1) % 6 === 0 && i !== filtered.length - 1;
    if (isBreakpoint) {
      const bannerIndex = Math.floor((i + 1) / 6 - 1) % banners.length;
      const banner = banners[bannerIndex];
      gridItems.push(
        <InfoBanner
          key={`banner-${i}`}
          title={banner.title}
          body={banner.body}
          ctaText={banner.ctaText}
          href={banner.href}
        />
      );
    }
  });

  const active = INDUSTRY_SECRETS.find((s) => s.id === openId);

  return (
    <main className="bg-gradient-to-br from-blue-50 via-white to-blue-100 border border-blue-200 rounded-3xl shadow-xl max-w-6xl mx-auto my-10 p-6 md:p-10">
      <header className="text-center mb-8 md:mb-10">
        <h1
          className="text-4xl md:text-5xl font-extrabold text-blue-900 tracking-tight"
          style={{ letterSpacing: "0.01em" }}
        >
          Limo & Party Bus — Industry Secrets
        </h1>
        <p className="mt-3 text-blue-900/80 max-w-3xl mx-auto">
          Insider tips operators don’t always advertise—use these to book
          smarter, avoid surprise fees, and get the most out of your ride.
        </p>

        {/* Search bar */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="mt-6 flex items-center justify-center"
          role="search"
          aria-label="Search industry secrets"
        >
          <div className="relative w-full max-w-2xl">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              type="search"
              placeholder="Search secrets (e.g. pricing, prom, Wi-Fi, cleaning fees)…"
              className="w-full rounded-2xl border border-blue-300 bg-white px-5 py-3 pr-24 shadow-sm outline-none placeholder:text-blue-900/40 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 text-blue-900 caret-blue-700"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl px-3 py-1 text-sm font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100"
                aria-label="Clear search"
              >
                Clear
              </button>
            )}
          </div>
        </form>
        <p className="mt-2 text-sm text-blue-900/60" aria-live="polite">
          {filtered.length} result{filtered.length === 1 ? "" : "s"}
        </p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {gridItems.length > 0 ? (
          gridItems
        ) : (
          <div className="sm:col-span-2 lg:col-span-3 rounded-2xl border border-blue-200 bg-white p-6 text-center">
            <p className="text-blue-900 font-semibold">No secrets found.</p>
            <p className="text-blue-900/70 mt-1">
              Try searching for “pricing”, “overtime”, “prom”, “Wi-Fi”, or
              “cleaning”.
            </p>
          </div>
        )}
      </section>

      <Modal open={!!active} onClose={closeSecret} title={active?.title ?? ""}>
        <p>{active?.details}</p>
      </Modal>
    </main>
  );
}
