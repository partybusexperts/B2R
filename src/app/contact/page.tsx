// src/app/contact/page.tsx
import React from "react";
import PageLayout from "../../components/PageLayout";
import Section from "../../components/Section";
import ContactForm from "../../components/ContactForm";
import HeroHeaderServer from "../../components/HeroHeaderServer";
import { getHeroFallback } from "../../data/heroFallbacks";

export default function ContactPage() {
  return (
    <PageLayout>
      <HeroHeaderServer pageSlug="contact" fallback={getHeroFallback("contact")} />

      <Section className="max-w-6xl mx-auto mb-24">
        <ContactForm />
      </Section>
    </PageLayout>
  );
}

