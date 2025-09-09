// src/app/contact/page.tsx
"use client";

import React from "react";
import PageLayout from "../../components/PageLayout";
import Section from "../../components/Section";
import ContactForm from "../../components/ContactForm";
import HeroHeader from "../../components/HeroHeader";

const PHONE_DISPLAY = "(888) 535-2566";
const PHONE_TEL = "8885352566";
const EMAIL = "info@bus2ride.com";

export default function ContactPage() {
  return (
    <PageLayout
      gradientFrom="from-blue-950"
      gradientVia="via-blue-900"
      gradientTo="to-black"
      textColor="text-white"
    >
      {/* ---------- HERO (dynamic via HeroHeader) ---------- */}
      <Section className="relative overflow-hidden min-h-[520px] md:min-h-[600px] !p-0 !py-0">
        {/**
         * FALLBACK content used when Supabase or a content row isn't available.
         * The HeroHeader component will attempt to load a row by page_slug from
         * your `content_points` table via the Supabase REST endpoint and merge
         * any returned JSON over this fallback.
         */}
        <HeroHeader
          pageSlug="contact"
          fallback={{
            page_slug: "contact",
            title: "Contact Us",
            subtitle: "Fast quotes, real humans, zero spam. Call, email, or use the form below.",
            phone_display: "(888) 535-2566",
            phone_tel: "8885352566",
            email: "info@bus2ride.com",
            primary_cta: { label: "Instant Live Quote", href: "/quote#instant" },
            secondary_cta: { label: "Email Us", href: "mailto:info@bus2ride.com" },
            tertiary_cta: { label: "Call (888) 535-2566", href: "tel:8885352566" },
            gradient_from: "from-blue-950",
            gradient_via: "via-blue-900",
            gradient_to: "to-black",
            text_color: "text-white",
            wave_fill: "#122a56",
          }}
        />
      </Section>

      {/* ---------- FORM (unchanged) ---------- */}
      <Section className="max-w-6xl mx-auto mb-24">
        <ContactForm />
      </Section>
    </PageLayout>
  );
}

