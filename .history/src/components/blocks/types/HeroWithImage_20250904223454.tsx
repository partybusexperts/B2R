import React from 'react';

export default function HeroWithImage(props: {
  eyebrow?: string; headline: string; subhead?: string;
  primaryCta?: { label: string; href: string };
}) {
  return (
    <section className="bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-16">
        {props.eyebrow && <p className="text-sm opacity-70">{props.eyebrow}</p>}
        <h1 className="mt-2 text-4xl font-semibold">{props.headline}</h1>
        {props.subhead && <p className="mt-3 text-lg opacity-90">{props.subhead}</p>}
        {props.primaryCta && (
          <a href={props.primaryCta.href} className="inline-flex mt-6 rounded-xl bg-primary px-5 py-3 text-white">
            {props.primaryCta.label}
          </a>
        )}
      </div>
    </section>
  );
}
