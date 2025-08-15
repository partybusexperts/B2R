"use client";
import React from "react";

export function ReviewForm() {
  return (
    <form
      className="flex flex-col gap-4 w-full max-w-md"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = new FormData(form);
  const res = await fetch("http://localhost:8000/api/reviews", {
          method: "POST",
          body: data,
        });
        if (res.ok) {
          alert("Review submitted!");
          form.reset();
        } else {
          alert("Error submitting review.");
        }
      }}
    >
      <input
        type="text"
        name="name"
        placeholder="Your Name"
        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
        required
      />
      <textarea
        name="review"
        placeholder="Your Review"
        rows={3}
        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
        required
      ></textarea>
      <input
        type="text"
        name="content"
        placeholder="Add a headline or content for your featured review (optional)"
        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-gray-700 mb-1">Add Photo</label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            className="block w-full text-gray-600"
          />
        </div>
        <div className="flex-1">
          <label className="block text-gray-700 mb-1">Add Video</label>
          <input
            type="file"
            name="video"
            accept="video/*"
            className="block w-full text-gray-600"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-yellow-400 text-xl">★★★★★</span>
        <input
          type="number"
          name="rating"
          min="1"
          max="5"
          defaultValue="5"
          className="w-16 border border-gray-300 rounded-lg px-2 py-1 text-center"
          required
        />
        <span className="text-gray-500">(1-5)</span>
      </div>
      <button
        type="submit"
        className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-2 rounded-lg shadow transition"
      >
        Submit Review
      </button>
      <p className="text-xs text-gray-400 mt-2">
        By submitting, you agree to let us feature your review, photos, and video on our site and social media.
      </p>
    </form>
  );
}
