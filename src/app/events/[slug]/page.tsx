import React from "react";

export default function EventPage({ params }: { params: { slug: string } }) {
  // You can customize this template for each event later
  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-extrabold text-blue-900 mb-6 capitalize drop-shadow">
        {params.slug.replace(/-/g, " ")}
      </h1>
      <p className="text-lg text-gray-700 mb-8">
        Details and booking info for <span className="font-bold">{params.slug.replace(/-/g, " ")}</span> coming soon! For immediate questions, call <a href="tel:8885352566" className="text-blue-700 underline font-bold">888-535-2566</a> or <a href="mailto:info@bus2ride.com" className="text-blue-700 underline font-bold">email us</a>.
      </p>
      <a href="/quote" className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg text-lg transition">Get a Free Quote</a>
    </main>
  );
}
