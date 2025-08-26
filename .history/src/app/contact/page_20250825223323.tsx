// src/app/contact/page.tsx
"use client";

import React from "react";
import PageLayout from "../../components/PageLayout";
import Section from "../../components/Section";
import ContactForm from "../../components/ContactForm";

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
      {/* ---------- HERO (matching PartyBusesPage style) ---------- */}
      <Section className="relative overflow-hidden min-h-[520px] md:min-h-[600px] flex flex-col items-center justify-center text-center !p-0 !py-0">
        {/* Primary bright gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-blue-600 to-indigo-900" />
        {/* Subtle sheen overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/10 mix-blend-overlay pointer-events-none" />

        <div className="pt-16" />
        <h1 className="relative z-10 text-5xl md:text-7xl font-extrabold mb-6 tracking-tight font-serif text-white drop-shadow-[0_6px_20px_rgba(0,0,0,.35)]">
          Contact Us
        </h1>
        <p className="relative z-10 text-2xl md:text-3xl max-w-3xl mx-auto mb-10 text-blue-50 font-medium drop-shadow">
          Fast quotes, real humans, zero spam. Call, email, or use the form below.
        </p>

        <div className="relative z-10 flex flex-col sm:flex-row gap-3 justify-center w-full max-w-3xl pb-10">
          <a
            href={`tel:${PHONE_TEL}`}
            className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center min-w-[210px] whitespace-nowrap bg-white/95 text-blue-900 hover:bg-white border-blue-200"
          >
            Call {PHONE_DISPLAY}
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center min-w-[210px] whitespace-nowrap bg-blue-600 text-white hover:bg-blue-700 border-blue-700"
          >
            Email Us
          </a>
          <a
            href="/quote#instant"
            className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center min-w-[210px] whitespace-nowrap bg-blue-800 text-white hover:bg-blue-900 border-blue-900"
          >
            ⚡ Instant Live Quote
          </a>
        </div>

        {/* Decorative wave divider */}
        <div className="absolute bottom-[-1px] left-0 right-0">
          <svg viewBox="0 0 1440 110" className="w-full h-[110px]" preserveAspectRatio="none">
            <path
              d="M0,80 C240,130 480,20 720,60 C960,100 1200,40 1440,80 L1440,120 L0,120 Z"
              fill="#122a56"
              opacity="1"
            />
          </svg>
        </div>
      </Section>

      {/* ---------- FORM (unchanged) ---------- */}
      <Section className="max-w-6xl mx-auto mb-24">
        <ContactForm />
      </Section>
    </PageLayout>
  );
}

