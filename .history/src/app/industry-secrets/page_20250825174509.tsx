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

const PHONE_DISPLAY = "(888) 535-2566";
const PHONE_TEL = "8885352566";
const EMAIL = "info@bus2ride.com";

// --- your INDUSTRY_SECRETS array unchanged (not repeated here for brevity) ---
import { INDUSTRY_SECRETS } from "../data/industrySecrets"; // or inline the big array

/* ---------------- Modal ---------------- */
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative z-10 w-full max-w-lg bg-gradient-to-br from-[#13306a] to-[#0e2250] border border-blue-800/40 rounded-2xl shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-blue-100 hover:text-white text-2xl font-bold"
          aria-label="Close"
        >
          ×
        </button>
        <h3 className="text-2xl font-extrabold text-white mb-3 font-serif tracking-tight">
          {title}
        </h3>
        <div className="text-blue-100 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

/* ---------------- Secret Card ---------------- */
function SecretCard({
  secret,
  onOpen,
}: {
  secret: Secret;
  onOpen: (id: string) => void;
}) {
  return (
    <div className="bg-[#12244e] rounded-2xl shadow-xl border border-blue-800/30 p-6 flex flex-col hover:scale-[1.02] transition-transform">
      <div className="text-xs uppercase tracking-wide text-blue-200 font-semibold">
        {secret.tag ?? "Secret"}
      </div>
      <h3 className="mt-1 text-lg font-bold text-white">{secret.title}</h3>
      <p className="mt-2 text-blue-100/90 text-sm">{secret.teaser}</p>
      <div className="mt-4">
        <button
          onClick={() => onOpen(secret.id)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white px-4 py-2 text-sm font-bold hover:bg-blue-700 border border-blue-700 transition"
        >
          Learn more →
        </button>
      </div>
    </div>
  );
}

/* ---------------- Info Banner ---------------- */
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
    <div className="sm:col-span-2 lg:col-span-3 bg-gradient-to-r from-sky-500 to-blue-700 rounded-2xl p-6 text-white shadow border border-blue-800/30">
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
        "Make sure your quote includes base hourly, taxes, fuel, tolls, cleaning, gratuity—compare apples to apples.",
      ctaText: "See Pricing",
      href: "/pricing",
    },
    {
      title: "Prom & Peak Saturdays = Plan Early",
      body:
        "Sundays–Thursdays unlock better vehicles and lower minimums. Flexibility is your secret weapon.",
      ctaText: "Ask About Off-Peak",
      href: "/contact",
    },
  ];

  const gridItems: React.ReactNode[] = [];
  filtered.forEach((secret, i) => {
    gridItems.push(
      <SecretCard key={secret.id} secret={secret} onOpen={setOpenId} />
    );
    const isBreakpoint = (i + 1) % 6 === 0 && i !== filtered.length - 1;
    if (isBreakpoint) {
      const banner = banners[(i / 6) % banners.length];
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
    <main className="text-slate-100 bg-[#0f1f46]">
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden min-h-[480px] flex flex-col items-center justify-center text-center py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-blue-600 to-indigo-900" />
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/10 mix-blend-overlay pointer-events-none" />

        <h1 className="relative z-10 text-5xl md:text-6xl font-extrabold mb-6 tracking-tight font-serif text-white drop-shadow-[0_6px_20px_rgba(0,0,0,.35)]">
          Limo & Party Bus — Industry Secrets
        </h1>
        <p className="relative z-10 text-2xl max-w-3xl mx-auto mb-10 text-blue-50 font-medium drop-shadow">
          Insider tips operators don’t always advertise—use these to book
          smarter, avoid surprise fees, and get the most out of your ride.
        </p>

        <div className="absolute bottom-[-1px] left-0 right-0">
          <svg viewBox="0 0 1440 110" className="w-full h-[110px]" preserveAspectRatio="none">
            <path
              d="M0,80 C240,130 480,20 720,60 C960,100 1200,40 1440,80 L1440,120 L0,120 Z"
              fill="#122a56"
            />
          </svg>
        </div>
      </section>

      {/* ---------- SECRETS ---------- */}
      <section className="bg-[#122a56] pt-8 pb-14">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* search bar */}
          <div className="w-full flex justify-center mb-6">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              type="search"
              placeholder="Search secrets (e.g. pricing, prom, Wi-Fi, cleaning fees)…"
              className="w-full max-w-2xl rounded-full px-6 py-4 text-lg bg-[#12244e] border border-blue-800/30 text-white placeholder-blue-200 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <p className="text-sm text-blue-200 text-center mb-8">
            {filtered.length} result{filtered.length === 1 ? "" : "s"}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridItems.length > 0 ? (
              gridItems
            ) : (
              <div className="sm:col-span-2 lg:col-span-3 rounded-2xl border border-blue-800/30 bg-[#12244e] p-6 text-center">
                <p className="text-white font-semibold">No secrets found.</p>
                <p className="text-blue-200 mt-1">
                  Try searching for “pricing”, “overtime”, “prom”, “Wi-Fi”, or “cleaning”.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modal */}
      <Modal open={!!active} onClose={() => setOpenId(null)} title={active?.title ?? ""}>
        <p>{active?.details}</p>
      </Modal>
    </main>
  );
}
