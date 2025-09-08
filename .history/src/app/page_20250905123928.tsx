
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

        // Step card for "How It Works" section (entire card clickable including icon)
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

