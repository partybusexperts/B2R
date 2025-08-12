'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form) as any);

    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Send failed');
      form.reset();
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    } catch (err) {
      alert('Sorry, something went wrong sending your message.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bg-gray-100 min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <h1 className="text-3xl font-bold text-center">Contact Us</h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          We’d love to hear from you! Fill out the form below.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="sr-only">Name</label>
            <input
              id="name" name="name" required
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Your Name"
            />
          </div>

          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email" name="email" type="email" required
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Email Address"
            />
          </div>

          <div>
            <label htmlFor="message" className="sr-only">Message</label>
            <textarea
              id="message" name="message" rows={4} required
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Your Message"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-indigo-600 text-white py-2 font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60"
          >
            {loading ? 'Sending…' : 'Send Message'}
          </button>
        </form>

        {showMessage && (
          <p className="mt-4 text-center text-sm text-green-600">
            Thank you! Your message has been submitted.
          </p>
        )}

        <p className="mt-6 text-center text-gray-700">
          Prefer to talk? Call <span className="font-bold">1-800-123-4567</span>.
        </p>
      </div>
    </main>
  );
}
