"use client";
import React from 'react';

interface TrustStat { value: string; label: string; }
interface TrustSectionProps {
  heading?: string;
  subheading?: string;
  stats?: TrustStat[];
  className?: string;
}

const DEFAULT_STATS: TrustStat[] = [
  { value: '4.9★', label: 'Average Rating' },
  { value: '10,000+', label: 'Happy Riders' },
  { value: 'On-Time', label: 'Promise' },
  { value: '100%', label: 'Upfront Pricing' }
];

export const TrustSection: React.FC<TrustSectionProps> = ({
  heading = 'The Most Trusted Limo & Bus Rental Company',
  subheading = 'Trusted by thousands, booked in minutes, driven by a passion for making every ride unforgettable.',
  stats = DEFAULT_STATS,
  className = ''
}) => {
  return (
    <section
      className={`relative bg-gradient-to-br from-blue-900/80 to-black overflow-hidden ${className}`}
      aria-labelledby="trust-heading"
    >
      <div className="pointer-events-none absolute -top-24 -left-20 w-[28rem] h-[28rem] bg-sky-400/20 blur-3xl rounded-full" />
      <div className="pointer-events-none absolute -bottom-28 -right-16 w-[32rem] h-[32rem] bg-indigo-500/20 blur-3xl rounded-full" />

      <div className="max-w-5xl mx-auto px-4 text-center relative py-2">
        <h2
          id="trust-heading"
          className="text-4xl md:text-5xl font-extrabold text-center mb-3 mt-10 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg tracking-tight"
        >
          {heading}
        </h2>
        <p className="text-xl text-blue-100/90 mb-8 font-semibold max-w-3xl mx-auto">{subheading}</p>

        <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6" aria-label="Key trust metrics">
          {stats.map((x, i) => (
            <li
              key={i}
              className="bg-white/95 text-blue-900 rounded-2xl border border-blue-200 shadow p-4 hover:-translate-y-0.5 transition will-change-transform"
            >
              <div className="text-2xl font-extrabold tracking-tight" aria-label={x.label}>{x.value}</div>
              <div className="text-blue-700 text-xs font-semibold uppercase tracking-wide">{x.label}</div>
            </li>
          ))}
        </ul>

        {/* Structured data for Organization & AggregateRating (approximate) */}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Bus2Ride',
              url: 'https://www.bus2ride.com',
              description: subheading,
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.9',
                ratingCount: 10000,
              }
            })
          }}
        />
      </div>
    </section>
  );
};

export default TrustSection;
