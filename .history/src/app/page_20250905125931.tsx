import React from "react";
import Section from "@/components/Section";
import StepCard from "@/components/StepCard";
import ToolsSlider from "@/components/tools/ToolsSlider";
import ClientOnly from "@/components/ClientOnly";
import HomePolls from "@/components/HomePolls";
import LiveWeatherAdvisor from "@/components/LiveWeatherAdvisor";
import ReviewForm from "@/components/ReviewForm";
import SlideshowMaker from "@/components/SlideshowMaker";

export default function Home() {
  return (
    <main>
      {/* Top CTA */}
      <Section className="max-w-4xl mx-auto text-center py-8">
        <a
          href="/quote#instant"
          className="inline-flex items-center gap-2 rounded-full font-extrabold px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white border border-emerald-600 shadow"
        >
          ⚡ Get Your Instant Quote
        </a>
      </Section>

      {/* How It Works */}
      <Section className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-4">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { icon: "📞", title: "Contact Us", body: "Call, email, or fill our form to get started." },
            { icon: "💬", title: "Get a Quote", body: "Fast, transparent pricing for your trip." },
            { icon: "📝", title: "Reserve Ride", body: "Place a small deposit to lock your vehicle." },
            { icon: "🎉", title: "Finalize & Ride", body: "Balance billed before trip; enjoy your ride." },
          ].map((s, i) => (
            <StepCard key={i} icon={s.icon} title={s.title} body={<p>{s.body}</p>} stepIndex={i} />
          ))}
        </div>
      </Section>

      {/* Testimonials */}
      <Section className="max-w-6xl mx-auto my-12">
        <h2 className="text-3xl font-extrabold text-center mb-6">What Our Customers Say</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { name: "Paul P.", text: "Absolutely excellent! Great customer service!" },
            { name: "Jessie A.", text: "The limo company that you need to call." },
          ].map((r, i) => (
            <div key={i} className="p-6 bg-slate-900 text-white rounded-lg">
              <p className="italic">{r.text}</p>
              <div className="mt-4 font-bold">{r.name}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Tools */}
      <Section className="max-w-7xl mx-auto my-12">
        <h2 className="text-3xl font-extrabold text-center mb-4">Tools</h2>
        <div className="bg-white rounded-xl p-4 shadow">
          <ToolsSlider />
        </div>
      </Section>

      {/* Polls (client-only) */}
      <Section className="max-w-6xl mx-auto my-12">
        <h2 className="text-3xl font-extrabold text-center mb-4">Industry Polls</h2>
        <ClientOnly>
          <HomePolls pickSize={50} visiblePerGroup={25} innerScroll={true} innerScrollClass="max-h-[50vh] overflow-y-auto" />
        </ClientOnly>
      </Section>

      {/* Live Weather Advisor */}
      <Section className="max-w-6xl mx-auto my-12">
        <LiveWeatherAdvisor />
      </Section>

      {/* Review & Slideshow */}
      <Section className="max-w-6xl mx-auto my-12">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-bold mb-2">Leave a Review</h3>
            <ReviewForm />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Slideshow Maker</h3>
            <SlideshowMaker />
          </div>
        </div>
      </Section>

      {/* Contact CTA */}
      <Section className="max-w-4xl mx-auto text-center py-8">
        <a href="tel:8885352566" className="rounded-xl font-bold px-6 py-3 bg-blue-700 text-white">Call (888) 535-2566</a>
      </Section>
    </main>
  );
}


  {/* Blog Topics header */}
<div className="max-w-6xl mx-auto px-4 mb-2">
  <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-6 md:mb-8 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg leading-[1.15] pb-2 tracking-tight">
    Blog Topics
  </h2>
  <p className="text-lg text-center text-blue-100 mb-8 md:mb-10 max-w-2xl mx-auto">
    Dive into our expert blog for tips, guides, and real-world advice on planning the perfect group trip. From wedding shuttles to prom safety, cost breakdowns, and more—get the knowledge you need to book with confidence and make your event unforgettable.
  </p>
</div>

/* Blog Cards with photo Read More overlay + footer CTA */
<Section className="bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl border border-blue-400 my-12">
  <div className="max-w-6xl mx-auto p-6 md:p-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
      {[
        {
          icon: "💍",
          title: "Wedding Shuttle Timeline: Exactly When to Book & How Many Runs",
          desc:
            "A step-by-step guide to planning your wedding shuttle, including timing and logistics for stress-free transport.",
          img: "/images/blog/wedding shuttle.jpg",
          href: "/blog/wedding-shuttle-timeline",
          tag: "Weddings",
        },
        {
          icon: "🚌",
          title: "Prom Bus Safety & Rules (Parents’ Quick Guide)",
          desc:
            "Everything parents need to know about prom bus safety, rules, and peace of mind for the big night.",
          img: "/images/blog/prom.jpg",
          href: "/blog/prom-bus-safety",
          tag: "Prom",
        },
        {
          icon: "🏟️",
          title: "College Gameday Bus: Tailgate Checklist + Stadium Drop-offs (DAL/AUS/HOU/DEN)",
          desc:
            "Your ultimate checklist for a winning tailgate and smooth stadium drop-off in major cities.",
          img: "/images/blog/college gameday.jpg",
          href: "/blog/college-gameday-bus-checklist",
          tag: "Sports",
        },
        {
          icon: "💰",
          title: "How Much Does a Party Bus Cost in [City]? (Real Ranges + Examples)",
          desc:
            "See real price ranges and examples for party bus rentals in your city, so you can budget with confidence.",
          img: "/images/blog/pricing.jpg",
          href: "/blog/party-bus-cost-city",
          tag: "Pricing",
        },
        {
          icon: "🤔",
          title: "Charter Bus vs Party Bus vs Limo: What’s Right for Your Group?",
          desc:
            "Compare the pros and cons of each vehicle type to find the perfect fit for your group and occasion.",
          img: "/images/blog/limo versus party bus.jpg",
          href: "/blog/charter-vs-partybus-vs-limo",
          tag: "Guides",
        },
        {
          icon: "🗺️",
          title: "Multi-Stop Night Out: Route Planning, Safety & Timing",
          desc:
            "How to pick smart routes, set time windows, and keep your group together across multiple pickups and drop-offs.",
          img: "/images/blog/multi stop night out.jpg",
          href: "/blog/multi-stop-night-out",
          tag: "Night Out",
        },
      ].map((post, idx) => (
        <article
          key={idx}
          className="group bg-white rounded-2xl overflow-hidden border-2 border-blue-200/70 hover:border-blue-300 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 focus-within:ring-4 focus-within:ring-blue-300/40"
        >
          {/* Photo with overlay Read More */}
          <div className="relative h-56 w-full bg-blue-50">
            <SmartImage
              src={post.img}
              alt={post.title}
              className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
            {/* Tag pill */}
            <span className="absolute top-3 left-3 rounded-full bg-blue-700/90 text-white text-xs font-bold px-3 py-1 border border-white/20 shadow">
              {post.tag}
            </span>

            {/* READ MORE overlay (image-level) */}
            <a
              href={post.href}
              className="absolute inset-x-0 bottom-0 p-3 md:p-4"
              aria-label={`Read more: ${post.title}`}
            >
              <span className="pointer-events-auto inline-flex items-center gap-2 rounded-xl bg-black/45 backdrop-blur px-4 py-2 text-white text-sm font-bold border border-white/20 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition">
                Read More
                <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-90">
                  <path
                    d="M13 5l7 7-7 7M5 12h14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </a>
          </div>

          {/* Body */}
          <div className="p-6 flex flex-col h-full">
            <div className="flex items-center gap-2 text-2xl mb-2">
              <span className="text-blue-500">{post.icon}</span>
              <h3 className="text-lg font-extrabold text-blue-900 leading-snug">
                {post.title}
              </h3>
            </div>
            <p className="text-blue-800/90 mb-5 flex-1">
              {post.desc}
            </p>

            {/* Footer CTA (secondary) */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-blue-700/80">
                Read time: 4–6 min
              </span>
              <a
                href={post.href}
                className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-4 py-2 rounded-lg border border-blue-800 transition"
              >
                Read More
                <svg width="18" height="18" viewBox="0 0 24 24" className="opacity-90">
                  <path
                    d="M13 5l7 7-7 7M5 12h14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Soft hover glow */}
          <div className="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 blur-sm bg-gradient-to-br from-sky-300/20 via-blue-500/20 to-indigo-400/20" />
        </article>
      ))}
    </div>

    {/* More posts CTA */}
    <div className="flex justify-center mt-2 md:mt-4">
      <a
        href="/blog"
        className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-xl transition inline-block text-center border border-blue-800"
      >
        More Blog Posts
      </a>
    </div>
  </div>
</Section>




  {/* Contact & Booking CTA */}
  <Section className="bg-blue-900 text-white">
    <div className="max-w-4xl mx-auto px-4 text-center">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-4 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg tracking-tight leading-[1.15] pb-2">Book Your Party Bus or Limo Today!</h2>
      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
        <a href="tel:8885352566" className="rounded-xl font-bold px-6 py-3 bg-white text-blue-900 hover:bg-blue-50 border border-blue-200 shadow">Call (888) 535-2566</a>
  <a href="/quote#instant" className="rounded-xl font-bold px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white border border-emerald-600 shadow">Get Instant Quote</a>
        <a href="mailto:info@bus2ride.com" className="rounded-xl font-bold px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white border border-blue-800 shadow">Email Us</a>
      </div>
    </div>
  </Section>
  </>
  );
}

