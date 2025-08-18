
'use client';


import React, { useState } from "react";
import PageLayout from "../../components/PageLayout";
import Section from "../../components/Section";


export default function ContactPage() {
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload: { name: string; email: string; message: string } = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      message: String(fd.get("message") ?? ""),
    };

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Send failed");
      form.reset();
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    } catch {
      alert("Sorry, something went wrong sending your message.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageLayout gradientFrom="from-blue-950" gradientVia="via-blue-900" gradientTo="to-black" textColor="text-white">
      <Section className="flex flex-col items-center justify-center text-center !p-0 !py-0 relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-700/30 via-blue-900/10 to-black" />
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg tracking-tight font-serif bg-gradient-to-r from-blue-400 via-blue-300 to-green-400 bg-clip-text text-transparent">
          Contact Us
        </h1>
        <p className="text-2xl md:text-3xl max-w-3xl mx-auto mb-10 text-blue-100 font-medium">
          We’d love to hear from you! Fill out the form below or call us anytime.
        </p>
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[120vw] h-40 bg-gradient-to-r from-blue-500/30 via-blue-500/20 to-green-500/10 blur-2xl opacity-60" />
      </Section>
      <Section className="max-w-md mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl my-12 py-10">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="sr-only">Name</label>
            <input
              id="name" name="name" required
              className="w-full rounded-full border-2 border-blue-400 bg-blue-950/80 px-5 py-3 text-lg text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow placeholder:text-blue-400 font-sans"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email" name="email" type="email" required
              className="w-full rounded-full border-2 border-blue-400 bg-blue-950/80 px-5 py-3 text-lg text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow placeholder:text-blue-400 font-sans"
              placeholder="Email Address"
            />
          </div>
          <div>
            <label htmlFor="message" className="sr-only">Message</label>
            <textarea
              id="message" name="message" rows={4} required
              className="w-full rounded-2xl border-2 border-blue-400 bg-blue-950/80 px-5 py-3 text-lg text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow placeholder:text-blue-400 font-sans"
              placeholder="Your Message"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-blue-700 to-green-500 text-white py-3 font-bold text-lg shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60 transition"
          >
            {loading ? "Sending…" : "Send Message"}
          </button>
        </form>
        {showMessage && (
          <p className="mt-4 text-center text-sm text-green-400 font-bold">
            Thank you! Your message has been submitted.
          </p>
        )}
        <p className="mt-6 text-center text-blue-200">
          Prefer to talk? Call <span className="font-bold">1-800-123-4567</span>.
        </p>
      </Section>
    </PageLayout>
  );
}
