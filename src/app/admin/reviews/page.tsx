"use client";
import React, { useEffect, useState } from "react";

// Admin review moderation page
export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const fetchReviews = () => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/api/reviews/all")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch reviews");
        return res.json();
      })
      .then((data) => setReviews(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const approve = async (idx: number) => {
    setActionMsg(null);
    const res = await fetch(`http://127.0.0.1:8000/api/reviews/approve/${idx}`, { method: "POST" });
    if (res.ok) {
      setActionMsg("Review approved.");
      fetchReviews();
    } else {
      setActionMsg("Failed to approve review.");
    }
  };

  const reject = async (idx: number) => {
    setActionMsg(null);
    // Remove review from file (for simplicity, just set status to 'rejected')
    const res = await fetch(`http://127.0.0.1:8000/api/reviews/reject/${idx}`, { method: "POST" });
    if (res.ok) {
      setActionMsg("Review rejected.");
      fetchReviews();
    } else {
      setActionMsg("Failed to reject review.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Admin Review Moderation</h1>
      {loading && <div>Loading…</div>}
      {error && <div className="text-red-600">{error}</div>}
      {actionMsg && <div className="mb-4 text-green-700">{actionMsg}</div>}
      <div className="space-y-6">
        {reviews.length === 0 && !loading && <div>No reviews found.</div>}
        {reviews.map((r, i) => (
          <div key={i} className="border rounded-lg p-4 bg-white shadow flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              <span className="font-bold text-blue-900">{r.name}</span>
              <span className="text-yellow-400">{'★'.repeat(r.rating)}</span>
              <span className="ml-2 text-xs px-2 py-1 rounded bg-gray-100 border border-gray-300">{r.status || 'pending'}</span>
            </div>
            {r.content && <div className="font-semibold text-blue-700">{r.content}</div>}
            <div className="italic text-gray-700">{r.review}</div>
            {r.photo_url && <img src={r.photo_url} alt="Review photo" className="rounded max-h-32" />}
            {r.video_url && <video src={r.video_url} controls className="rounded max-h-32 w-full" />}
            <div className="flex gap-2 mt-2">
              {r.status !== 'approved' && (
                <button className="bg-green-600 text-white px-4 py-1 rounded" onClick={() => approve(i)}>Approve</button>
              )}
              {r.status !== 'rejected' && (
                <button className="bg-red-600 text-white px-4 py-1 rounded" onClick={() => reject(i)}>Reject</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
