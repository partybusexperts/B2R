"use client";
import React, { useEffect, useState } from "react";

type Review = {
  name: string;
  review: string;
  content?: string;
  rating: number;
  photo_url?: string;
  video_url?: string;
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/reviews")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch reviews");
        return res.json();
      })
      .then((data) => setReviews(data.reverse()))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-8 text-blue-900 tracking-tight">
        Customer Reviews
      </h1>
      <p className="text-lg text-center text-gray-700 mb-12">
        Bus2Ride prides itself on happy customers. Here are real reviews from our riders!
      </p>
      {loading && <div className="text-center">Loading reviews…</div>}
      {error && <div className="text-center text-red-600">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10 max-w-4xl mx-auto">
        {reviews.length === 0 && !loading && (
          <div className="col-span-2 text-center text-gray-500">No reviews yet. Be the first to leave one!</div>
        )}
        {reviews.map((r, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between min-h-[220px]">
            {r.content && <div className="font-bold text-blue-900 mb-2">{r.content}</div>}
            <p className="text-gray-700 italic mb-4 text-lg">{r.review}</p>
            {r.photo_url && (
              <img src={r.photo_url} alt="Review photo" className="rounded-lg mb-2 max-h-40 object-contain" />
            )}
            {r.video_url && (
              <video src={r.video_url} controls className="rounded-lg mb-2 max-h-40 w-full" />
            )}
            <div className="flex items-center gap-2 mt-2">
              <span className="font-bold text-blue-700">— {r.name}</span>
              <span className="text-yellow-400">{'★'.repeat(r.rating)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
