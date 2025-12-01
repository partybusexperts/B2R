"use client";

import React from "react";
import SmartImage from "../SmartImage";

const CTA = {
  base:
    "inline-flex items-center justify-center rounded-full font-bold text-sm tracking-tight shadow-md transition border min-w-[160px] h-10 px-5 active:translate-y-[1px]",
  primary:
    "bg-blue-600 text-white border-blue-700 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500",
  secondary: "bg-white text-blue-900 border-blue-200 hover:bg-blue-50",
  accent: "bg-blue-700 text-white border-blue-700 hover:bg-blue-800",
};

const PHONE_DISPLAY = "(888) 535-2566";
const PHONE_TEL = "8885352566";
const EMAIL = "info@bus2ride.com";

type Props = {
  name: string;
  description: string;
  href: string;
  imageSrc: string;
  slug: string;
};

export default function EventCard({ name, description, href, imageSrc, slug }: Props) {
  return (
    <article
      className="relative bg-[#0f1f46] rounded-3xl border border-blue-800/40 p-6 min-h-[480px] flex flex-col items-center shadow-[0_10px_28px_-4px_rgba(0,0,0,.45)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-6px_rgba(0,0,0,.55)]"
    >
      <div className="w-full group">
        <a href={href} aria-label={`Learn more about ${name}`} className="block no-underline">
          <SmartImage
            src={imageSrc}
            alt={name}
            className="rounded-2xl shadow-lg w-full h-64 object-cover object-center mb-4 border border-blue-800/40"
          />
          <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-2 font-serif text-center group-hover:text-blue-100 transition-colors">
            {name}
          </h3>
          <p className="text-base md:text-lg text-blue-100/90 text-center mb-6">{description}</p>
        </a>
      </div>
      <div className="flex flex-row flex-wrap gap-2 justify-center items-center w-full mt-auto">
        <a href="/quote#instant" className={`${CTA.base} ${CTA.primary}`}>
          Quote
        </a>
        <a href={`tel:${PHONE_TEL}`} className={`${CTA.base} ${CTA.secondary}`}>
          📞 {PHONE_DISPLAY}
        </a>
        <a href={`mailto:${EMAIL}`} className={`${CTA.base} ${CTA.primary}`}>
          Email
        </a>
        <a href={`/polls?tag=${encodeURIComponent(slug)}`} className={`${CTA.base} ${CTA.accent}`}>
          Related Polls
        </a>
      </div>
    </article>
  );
}
