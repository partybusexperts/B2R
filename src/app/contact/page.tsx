// src/app/contact/page.tsx
import React from "react";
import PageLayout from "../../components/PageLayout";
import Section from "../../components/Section";
import ContactForm from "../../components/ContactForm";
import HeroHeader from "../../components/HeroHeader";

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE; // server-only key

async function fetchContactHero() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) return null;
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);
    const orClause = `key.eq.hero-contact,key.eq.contact-hero,page_slug.eq.contact`;
    const { data, error } = await supabase
      .from('content_points')
      .select('*')
      .or(orClause)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) return null;
  const candidate = data?.body ?? data?.data ?? data?.content ?? data?.json ?? data?.props ?? data ?? null;
    if (!candidate) return null;
    if (typeof candidate === 'string') {
      try { return JSON.parse(candidate); } catch { return null; }
    }
    return candidate;
  } catch {
    return null;
  }
}

export default async function ContactPage() {
  const serverData = await fetchContactHero();

  const fallback = {
    page_slug: "contact",
    title: "Contact Us",
  subtitle: "Fast quotes, real humans, zero spam. Call, email, or use the form below.",
  phone_display: "(888) 535-2566",
  phone_tel: "8885352566",
  email: "info@bus2ride.com",
  primary_cta: { label: "Get Instant Quote", href: "/quote#instant" },
  secondary_cta: { label: "View Fleet", href: "/fleet" },
  tertiary_cta: { label: "Contact Us", href: "mailto:info@bus2ride.com" },
  gradient_from: "from-sky-400",
  gradient_via: "via-blue-600",
  gradient_to: "to-indigo-900",
  text_color: "text-white",
  wave_fill: "#122a56",
  };

  return (
    <PageLayout
      gradientFrom="from-blue-950"
      gradientVia="via-blue-900"
      gradientTo="to-black"
      textColor="text-white"
    >
      {/* ---------- HERO (dynamic via HeroHeader) ---------- */}
      <Section className="relative overflow-hidden min-h-[520px] md:min-h-[600px] !p-0 !py-0">
        <HeroHeader pageSlug="contact" fallback={fallback} initialData={serverData} />
      </Section>

      {/* ---------- FORM (unchanged) ---------- */}
      <Section className="max-w-6xl mx-auto mb-24">
        <ContactForm />
      </Section>
    </PageLayout>
  );
}

