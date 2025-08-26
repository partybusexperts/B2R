
'use client';

import React from 'react';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import ContactForm from '../../components/ContactForm';

export default function ContactPage() {
  return (
    <PageLayout gradientFrom="from-blue-950" gradientVia="via-blue-900" gradientTo="to-black" textColor="text-white">
      {/* Hero */}
      <Section className="flex flex-col items-center justify-center text-center !p-0 !py-0 relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-700/40 via-blue-900/15 to-black" />
        <div className="pt-16" />
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg tracking-tight font-serif bg-gradient-to-r from-blue-300 via-white to-blue-500 bg-clip-text text-transparent">
          Contact Us
        </h1>
        <p className="text-2xl md:text-3xl max-w-3xl mx-auto mb-10 text-blue-100 font-medium">
          Fast quotes, real humans, zero spam. Call, email, or use the form below.
        </p>
        <div className="pb-10" />
      </Section>
      {/* Form */}
      <Section className="max-w-6xl mx-auto mb-24">
        <ContactForm />
      </Section>
    </PageLayout>
  );
}
