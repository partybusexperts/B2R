"use client";

// All other imports and code follow below

import React, { useState } from "react";
import PageLayout from "../../components/PageLayout";
import Section from "../../components/Section";

export default function Page() {
  // Example blog posts (replace with real data or API later)
  const sampleImages = [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1465101178521-c1a9136a3c5c?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1465101178521-c1a9136a3c5c?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
  ];
  const posts = [
    {
      title: "The Ultimate Guide to Booking a Party Bus",
      excerpt: "Everything you need to know about booking, pricing, and enjoying your next party bus experience.",
      date: "2025-08-01",
      author: "Bus2Ride Team",
      image: sampleImages[0],
    },
    {
      title: "Top 10 Limo Trends for 2025",
      excerpt: "From eco-friendly limos to high-tech amenities, see what's hot in luxury transportation this year.",
      date: "2025-07-15",
      author: "Bus2Ride Editors",
      image: sampleImages[1],
    },
    {
      title: "How to Choose the Right Vehicle for Your Event",
      excerpt: "A quick guide to picking the perfect ride for weddings, proms, and more.",
      date: "2025-07-01",
      author: "Bus2Ride Team",
      image: sampleImages[2],
    },
    {
      title: "5 Reasons to Book a Shuttle for Your Next Corporate Event",
      excerpt: "Discover why shuttles are the best choice for moving groups efficiently and comfortably.",
      date: "2025-06-20",
      author: "Corporate Travel Expert",
      image: sampleImages[3],
    },
    {
      title: "Prom Night Transportation: Safety Tips for Teens & Parents",
      excerpt: "How to make prom night fun and safe with the right limo or party bus.",
      date: "2025-06-01",
      author: "Bus2Ride Safety Team",
      image: sampleImages[4],
    },
    {
      title: "The Rise of Electric Party Buses",
      excerpt: "Sustainable group travel is here—see how electric buses are changing the game.",
      date: "2025-05-15",
      author: "Green Fleet News",
      image: sampleImages[5],
    },
    {
      title: "How to Plan a Brewery Tour by Bus",
      excerpt: "Tips for organizing the perfect group brewery or winery tour with a charter bus.",
      date: "2025-05-01",
      author: "Bus2Ride Team",
      image: sampleImages[6],
    },
    {
      title: "Luxury vs. Standard Limo: What’s the Difference?",
      excerpt: "A breakdown of features, pricing, and when to splurge on a luxury ride.",
      date: "2025-04-20",
      author: "Limo Insider",
      image: sampleImages[7],
    },
    {
      title: "Best Group Travel Destinations for 2025",
      excerpt: "Our picks for the top cities and events to visit with a party bus or coach.",
      date: "2025-04-01",
      author: "Bus2Ride Editors",
      image: sampleImages[8],
    },
    {
      title: "How to Save Money on Wedding Transportation",
      excerpt: "Smart tips for getting the best value on limos, shuttles, and party buses for your big day.",
      date: "2025-03-15",
      author: "Wedding Planner Pro",
      image: sampleImages[9],
    },
    {
      title: "What to Expect from a Professional Chauffeur",
      excerpt: "The hallmarks of great service and how to spot a true pro behind the wheel.",
      date: "2025-03-01",
      author: "Bus2Ride Team",
      image: sampleImages[10],
    },
    {
      title: "The Future of Group Transportation: Trends to Watch",
      excerpt: "From AI-powered booking to luxury amenities, here’s what’s next for the industry.",
      date: "2025-02-15",
      author: "Industry Analyst",
      image: sampleImages[11],
    },
  ];

  const [search, setSearch] = useState("");
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageLayout gradientFrom="from-blue-950" gradientVia="via-blue-900" gradientTo="to-black" textColor="text-white">
      <Section className="flex flex-col items-center justify-center text-center !p-0 !py-0 relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-700/30 via-blue-900/10 to-black" />
        <div className="pt-16" />
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg tracking-tight font-serif bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 bg-clip-text text-transparent">
          Blog & Insights
        </h1>
        <p className="text-2xl md:text-3xl max-w-3xl mx-auto mb-12 text-blue-100 font-medium">
          The latest news, tips, and trends in group transportation, party buses, limos, and more—brought to you by Bus2Ride.com.
        </p>
        <div className="w-full flex justify-center mb-8">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search blog posts..."
            className="w-full max-w-xl rounded-full px-6 py-3 text-lg bg-blue-950/80 border border-blue-700/40 text-blue-100 placeholder-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-400/40 transition shadow-lg"
            aria-label="Search blog posts"
          />
        </div>
        <div className="pb-10" />
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[120vw] h-40 bg-gradient-to-r from-blue-500/30 via-blue-500/20 to-blue-400/10 blur-2xl opacity-60" />
      </Section>
      <Section className="max-w-7xl mx-auto mb-16 bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl py-10">
        {filteredPosts.length === 0 ? (
          <div className="text-blue-200 text-xl text-center py-20">No blog posts found.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredPosts.map((post, idx) => (
              <div
                key={post.title}
                className="group bg-blue-950/90 rounded-2xl shadow-2xl p-6 flex flex-col border border-blue-700/20 hover:scale-105 hover:shadow-2xl transition-all duration-200 overflow-hidden text-white"
              >
                <div className="aspect-[4/2.2] w-full rounded-xl overflow-hidden mb-5 bg-blue-900/60 flex items-center justify-center">
                  {/* Replace with <Image /> if using next/image and real images */}
                  <img
                    src={post.image}
                    alt={post.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                  />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-blue-100 font-serif tracking-wide">
                  {post.title}
                </h2>
                <p className="text-blue-200 mb-4 text-base font-sans min-h-[60px]">{post.excerpt}</p>
                <div className="flex items-center justify-between text-blue-400 text-sm mt-auto">
                  <span>{post.author}</span>
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </PageLayout>
  );
}
