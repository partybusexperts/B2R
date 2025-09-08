import React from "react";
import Section from "../components/Section";
import StepCard from "../components/StepCard";
import ToolsSlider from "../components/ToolsSlider";
import ClientOnly from "../components/ClientOnly";
import HomePolls from "../components/HomePolls";
import LiveWeatherAdvisor from "../components/LiveWeatherAdvisor";
import { ReviewForm } from "../components/ReviewForm";
import SlideshowMaker from "../components/SlideshowMaker";

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
      import React from "react";
      import PageLayout from "@/components/PageLayout";
      import Section from "@/components/Section";
      import StepCard from "@/components/StepCard";
      import ToolsSlider from "@/components/tools/ToolsSlider";
      import ClickableCard from "@/components/ClickableCard";
      import SmartImage from "@/components/SmartImage";
      import ClientOnly from "@/components/ClientOnly";
      import HomePolls from "@/components/HomePolls";
      import LiveWeatherAdvisor from "@/components/LiveWeatherAdvisor";
      import ReviewForm from "@/components/ReviewForm";
      import SlideshowMaker from "@/components/SlideshowMaker";

      export default function Home() {
        return (
          <>
            {/* (removed orphaned feature card block to fix unbalanced JSX) */}
            {/* CTA ribbon */}
            <div className="mt-8 mb-2">
            <a
              href="/quote#instant"
              className="inline-flex items-center gap-2 rounded-full font-extrabold px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white border border-emerald-600 shadow"
            >
              ⚡ Get Your Instant Quote
            </a>
          </div>


          {/* How It Works */}
      <Section className="relative max-w-5xl mx-auto bg-gradient-to-br from-blue-900/80 to-black overflow-hidden">
        {/* light deco */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] bg-sky-400/20 blur-3xl rounded-full" />

        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-6 mt-2 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg leading-[1.15] pb-1">
          How It Works
        </h2>
        <p className="text-blue-100/90 text-center max-w-2xl mx-auto -mt-1 mb-7 font-medium">
          Four simple steps from “hello” to wheels rolling. Each card opens for quick details.
        </p>

        {/* connected timeline on desktop */}
        <div className="relative">
          {/* connector line (desktop) */}
          <div className="hidden md:block absolute left-0 right-0 top-[70px] h-[3px] bg-gradient-to-r from-blue-500/50 via-blue-300/50 to-blue-500/50 rounded-full" />

          <div className="grid md:grid-cols-4 gap-6 text-center relative z-10">
            {[
              {
                icon: "📞",
                label: "1. Contact Us",
                title: "Contact Us",
                body: <p>Call, email, or fill our form to get started. We’ll match the best vehicle to your trip.</p>,
              },
              {
                icon: "💬",
                label: "2. Get a Quote",
                title: "Get a Quote",
                body: <p>Fast, transparent pricing by city, date, hours, and group size. No hidden fees—ever.</p>,
              },
              {
                icon: "📝",
                label: "3. Reserve Ride",
                title: "Reserve Your Ride",
                body: (
                  <p>
                    Place a small deposit to lock in your vehicle. We’ll confirm details & send your agreement. In most cases
                    you’ll receive a secure DocuSign to sign and (for fraud prevention) attach a photo of your ID plus the
                    payment card (front only). This quick step protects both you and us from unauthorized use.
                  </p>
                ),
              },
              {
                icon: "🎉",
                label: "4. Finalize & Ride",
                title: "Finalize & Ride",
                body: <p>Balance is billed 7–14 days before. On trip day, just relax—we handle the rest.</p>,
              },
            ].map((s, i) => (
              <StepCard key={i} icon={s.icon} label={s.label} title={s.title} body={s.body} stepIndex={i} />
            ))}
          </div>
        </div>

        {/* bottom CTA strip */}
        <div className="flex justify-center mt-8">
          <div className="inline-flex flex-wrap gap-2 items-center bg-white/95 text-blue-900 border border-blue-200 shadow rounded-full px-3 py-2">
            <span className="font-semibold">Need help choosing?</span>
            <a
              href="/quote#instant"
              className="rounded-full font-bold px-4 py-1.5 bg-blue-700 text-white hover:bg-blue-800 border border-blue-800 shadow-sm"
            >
              ⚡ Instant Quote
            </a>
            <a
              href="tel:8885352566"
              className="rounded-full font-bold px-4 py-1.5 bg-white text-blue-900 hover:bg-blue-50 border border-blue-200 shadow-sm"
            >
              Call (888) 535-2566
            </a>
          </div>
        </div>
      </Section>



       {/* Testimonials */}
      <Section className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-14 px-6 border border-blue-800/30">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg tracking-tight">
          What Our Customers Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
          {[
            {
              name: "Paul P.",
              text: "Absolutely excellent! Great customer service! We changed drop off points several times and they were so accommodating. Gail in the office is top notch and on top of everything! The price was very good. The driver was so nice and professional. The limo looked pristine, inside and out. Use them, you won’t regret it!! Used for my son's wedding on August 11.",
            },
            {
              name: "Jessie A.",
              text: "The limo company that you need to call when you have an event. Prices and limos and party buses are like no other limo company.",
            },
            {
              name: "Dee C.",
              text: "Definitely lives up to their name! We used them for our bachelorette/bachelor parties and our wedding and will be using them again. They were absolutely great! Even let me extend an hour when I decided my bachelorette party was too much fun and I wasn't ready to go yet!! I would absolutely recommend them and do to everyone!!",
            },
            {
              name: "Halee H.",
              text: "The price is great, inside is very clean, driver was very friendly and accommodating! Will never use another company besides this one!",
            },
          ].map((review, idx) => (
            <div
              key={idx}
              className="relative bg-[#12244e] border border-blue-800/40 rounded-2xl shadow-xl p-8 flex flex-col justify-between hover:scale-[1.02] transition-transform"
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 -left-4 bg-blue-600 text-white w-10 h-10 flex items-center justify-center rounded-xl shadow-md text-2xl">
                “
              </div>

              {/* Review Text */}
              <p className="text-blue-100 italic mb-6 leading-relaxed text-lg">
                {review.text}
              </p>

              {/* Reviewer Info */}
              <div className="flex items-center gap-3 mt-auto">
                <div className="bg-blue-600 rounded-full w-11 h-11 flex items-center justify-center text-white font-bold shadow-md">
                  {review.name[0]}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-white">{review.name}</span>
                  <span className="text-yellow-400 text-sm">★★★★★</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* More Reviews Button */}
        <div className="flex justify-center">
          <a
            href="/reviews"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition border border-blue-700"
          >
            MORE REVIEWS
          </a>
        </div>
      </Section>


      {/* TOOLS — award-level wrapper around your existing ToolsSlider */}
      <Section id="tools" className="relative max-w-7xl mx-auto overflow-hidden">
        {/* subtle background lighting */}
        <div className="pointer-events-none absolute -top-28 -left-20 w-[34rem] h-[34rem] bg-sky-400/15 blur-3xl rounded-full" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 w-[30rem] h-[30rem] bg-indigo-500/15 blur-3xl rounded-full" />

        {/* heading */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mt-10 mb-3 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg tracking-tight">
          Tools
        </h2>
        <p className="text-lg md:text-xl text-center text-blue-100 max-w-3xl mx-auto px-4">
          Plan smarter with our free, pro-grade helpers—quotes, splitters, route planners, comfort checks, and more.
        </p>

        {/* quick stat pills */}
        <div className="mt-6 mb-6 flex flex-wrap items-center justify-center gap-3 px-4">
          {[
            { k: "Instant", v: "⚡ Quotes" },
            { k: "Smart", v: "🧠 Planning" },
            { k: "Zero", v: "💵 Fees" },
            { k: "Mobile", v: "📱 Friendly" },
          ].map((p) => (
            <div
              key={p.v}
              className="inline-flex items-center gap-2 rounded-full border border-blue-300/30 bg-white/10 backdrop-blur px-4 py-2 text-sm text-blue-100 shadow"
            >
              <span className="font-semibold text-white">{p.k}</span>
              <span className="opacity-80">{p.v}</span>
            </div>
          ))}
        </div>

        {/* framed slider card */}
        <div className="relative mx-auto max-w-6xl">
          {/* glow border */}
          <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-br from-sky-300/40 via-blue-500/30 to-indigo-400/40 opacity-60 blur-sm" />
          <div className="relative rounded-3xl bg-[#0f2148]/80 backdrop-blur border border-blue-800/40 shadow-[0_10px_30px_rgba(2,6,23,.35)] p-5 md:p-7">
            {/* title bar */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
              </div>
              <span className="ml-2 text-blue-100/90 text-sm">
                Bus2Ride Tools • <span className="opacity-70">To Help Our Customers Make Decisions</span>
              </span>
              <span className="ml-auto text-[11px] font-semibold text-emerald-300/90 bg-emerald-500/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
                New tools added weekly
              </span>
            </div>

            {/* your existing slider lives here */}
            <div className="rounded-2xl bg-white shadow-xl border-2 border-blue-100 p-4 md:p-6">
              <ToolsSlider />
            </div>

            {/* footer helper row */}
            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
              <a
                href="/quote#instant"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold bg-white text-blue-900 hover:bg-blue-50 border border-blue-200 transition text-center"
              >
                ⚡ Get Instant Quote
              </a>
              <a
                href="/tools"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold bg-blue-700 text-white hover:bg-blue-800 border border-blue-800 transition text-center"
              >
                🔧 Explore All Tools
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold bg-blue-900 text-white hover:bg-blue-950 border border-blue-950 transition text-center"
              >
                🧑‍💼 Need a Custom Tool?
              </a>
            </div>
          </div>
        </div>

        {/* small helper note */}
        <div className="text-center text-blue-200/80 text-sm mt-6">
          Tip: Open on mobile to see the tools adapt perfectly to small screens.
        </div>
      </Section>

        {/* Polls */}
        <Section className="max-w-6xl mx-auto bg-gradient-to-br from-blue-900/80 to-black">
        <div className="max-w-6xl mx-auto px-4 mt-12 mb-2">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-10 mt-8 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg tracking-tight">Limo Industry Polls</h2>
          <p className="text-lg text-center text-blue-100 mb-6 max-w-2xl mx-auto">
            See what real riders and industry pros are saying! Our live polls help you compare trends, get honest opinions, and make smarter choices for your next trip. Vote, view results, and join the conversation.
          </p>
        </div>
        <ClientOnly>
        {/* Homepage: show up to 150 polls (50 per column) to match requested layout */}
        <HomePolls pickSize={150} visiblePerGroup={50} innerScroll={true} innerScrollClass="max-h-[60vh] overflow-y-auto no-scrollbar p-2 -mr-2" />
        </ClientOnly>
        </Section>
        {/* Live Weather & Comfort Advisor */}
        <Section className="bg-gradient-to-br from-blue-900/80 to-black">
        <div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 mt-0 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg leading-[1.15] pb-2 tracking-tight">
            Smart Weather & Comfort Tips
          </h2>
          <p className="text-lg text-center text-blue-100 mb-10 max-w-2xl mx-auto">
            Get real-time weather and comfort tips for your trip—no matter the season or city. We check the latest forecast and give you practical advice on what to wear, what to bring, and how to make your ride as comfortable as possible. Stay prepared and enjoy your journey!
          </p>
          <LiveWeatherAdvisor />
        </div>
        </Section>

            {/* Review Submission & Slideshow Maker (Python backend suggestion) */}
            <Section className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto bg-gradient-to-br from-blue-900/80 to-black">
              <div className="flex flex-col md:flex-row gap-8 w-full">
                <div className="flex-1">
                  <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-8 tracking-tight">
                    <span className="bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">Leave a Review & Get Featured Above!</span>
                  </h2>
                  <p className="text-blue-100 mb-4">
                    Want to see your review in the main section above? Share your Bus2Ride experience below! Submit your review, add photos, or even upload a video. The best reviews will be featured at the top of this page for everyone to see.
                  </p>
                  <p className="text-green-400 font-semibold mb-2">
                    Featured reviews may appear on our homepage and social media.
                  </p>
                  <ReviewForm />
                </div>
                <div className="flex-1 min-w-[260px] border-l border-gray-200 pl-0 md:pl-8 flex flex-col items-center md:items-start">
                  <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-8 tracking-tight">
                    <span className="bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">Make & Share Your Slideshow Video</span>
                  </h2>
                  <p className="text-blue-100 mb-4">
                    Upload your favorite party or limo photos (or anything else you’d like to share) and we’ll instantly turn them into a fun, shareable slideshow video—perfect for posting on Facebook, Instagram, or linking on your blog, website, or email. Show off your ride, your event, or your crew—then share the link anywhere!
                  </p>
                  <div id="slideshow-tool" className="w-full flex flex-col items-center mb-2" />
                  <SlideshowMaker />
                </div>
              </div>
            </Section>

        {/* EVENTS & OCCASIONS — 4 per row, wide cards, no image overlay */}
      <Section className="max-w-7xl mx-auto relative overflow-hidden bg-gradient-to-br from-blue-900/80 to-black">
        {/* (Optional) Confetti decorations — keep or remove */}
        <svg className="absolute left-0 top-0 w-48 h-48 opacity-20 pointer-events-none" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="40" r="12" fill="#60a5fa" />
          <rect x="120" y="30" width="18" height="18" rx="4" fill="#fbbf24" />
          <circle cx="170" cy="80" r="8" fill="#f472b6" />
          <rect x="60" y="120" width="14" height="14" rx="3" fill="#34d399" />
          <circle cx="180" cy="180" r="10" fill="#818cf8" />
        </svg>
        <svg className="absolute right-0 bottom-0 w-56 h-56 opacity-20 pointer-events-none" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="180" cy="40" r="14" fill="#fbbf24" />
          <rect x="30" y="160" width="20" height="20" rx="5" fill="#60a5fa" />
          <circle cx="60" cy="60" r="10" fill="#f472b6" />
          <rect x="120" y="120" width="16" height="16" rx="4" fill="#34d399" />
          <circle cx="40" cy="200" r="12" fill="#818cf8" />
        </svg>

        <div className="relative z-10 max-w-6xl mx-auto px-4 pt-12">
          {/* Header */}
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-4 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg tracking-tight">
            Events & Occasions
          </h2>
          <p className="text-lg text-center text-blue-100 mb-12 max-w-2xl mx-auto">
            Weddings, proms, concerts, sporting events, winery tours, nights out—pick your occasion and we’ll match the perfect ride.
          </p>

          {/* Grid: 1 / 2 / 3 / 4 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {eventNames.map((event, i) => {
              const slug = event.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
              const img = eventImages[i];
              const insertCta = i === 7 || i === 15;
              return (
                <React.Fragment key={event}>
                  {/* Event Card (client wrapper handles navigation & keyboard) */}
                  <ClickableCard
                    slug={slug}
                    ariaLabel={`${event} details`}
                    className="group cursor-pointer relative rounded-[24px] overflow-hidden border border-blue-800/30 bg-[#173264] shadow-[0_10px_30px_rgba(2,6,23,.35)] hover:shadow-2xl hover:-translate-y-1 transition focus:outline-none focus:ring-4 focus:ring-blue-400/40"
                  >
                    {/* Image (taller, roomy) */}

                    <div className="h-80 w-full bg-[#18356e] relative">
                      {img?.original ? (
                        <SmartImage
                          src={img.original}
                          alt={img.alt || event}
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                          sizes="(max-width:768px) 100vw, 540px"
                          loading="lazy"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-red-900/80 text-white font-bold text-center p-4 z-10">
                          Missing image for event:<br />
                          <span className="break-all">{eventImageMap[event]}</span>
                        </div>
                      )}
                    </div>

                    {/* Body (title + subtitle, then buttons) */}
                    <div className="px-6 py-6">
                      <h3 className="text-2xl font-extrabold text-white tracking-tight mb-1">{event}</h3>
                      <p className="text-blue-100/90 text-sm mb-5">
                        {eventBlurbMap[event] ?? 'On-time pickups • Clean rides • Seamless drop-offs'}
                      </p>

                      <div className="grid grid-cols-3 gap-3">
                        <a
                          href="tel:8885352566"
                          className="inline-flex items-center justify-center rounded-xl px-3 py-3 font-bold bg-blue-600 text-white hover:bg-blue-700 border border-blue-700 transition"
                        >
                          Call
                        </a>
                        <a
                          href="mailto:info@bus2ride.com"
                          className="inline-flex items-center justify-center rounded-xl px-3 py-3 font-bold bg-blue-800 text-white hover:bg-blue-900 border border-blue-900 transition"
                        >
                          Email
                        </a>
                        <a
                          href="/quote#instant"
                          className="inline-flex items-center justify-center rounded-xl px-3 py-3 font-bold bg-white text-blue-900 hover:bg-blue-50 border border-blue-200 transition"
                        >
                          Quote
                        </a>
                      </div>
                    </div>

                    {/* Soft glow on hover */}
                    <div className="pointer-events-none absolute -inset-[1px] rounded-[24px] opacity-0 group-hover:opacity-100 transition duration-300 blur-sm bg-gradient-to-br from-sky-300/20 via-blue-500/20 to-indigo-400/20" />
                  </ClickableCard>

                  {/* Mid-grid CTA bands after full rows (8th, 16th, …) */}
                  {insertCta && (
                    <div className="col-span-full">
                      <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white rounded-2xl shadow-xl px-6 md:px-10 py-10 flex flex-col items-center w-full border-2 border-blue-400">
                        <div className="text-3xl md:text-4xl font-extrabold text-center mb-3 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg tracking-tight">
                          Ready to Book or Have Questions?
                        </div>
                        <div className="mb-6 text-lg text-blue-100 text-center">
                          Call <a href="tel:8885352566" className="underline font-bold">888-535-2566</a> or email{" "}
                          <a href="mailto:info@bus2ride.com" className="underline font-bold">info@bus2ride.com</a>
                        </div>
                        <a
                          href="/quote#instant"
                          className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg text-lg transition border border-emerald-600"
                        >
                          Get a Free Quote
                        </a>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Final CTA */}
          <div className="flex justify-center mt-12">
            <a
              href="/events"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition border border-blue-700"
            >
              Browse All Events
            </a>
          </div>
        </div>
      </Section>


