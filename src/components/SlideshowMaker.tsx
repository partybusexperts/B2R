"use client";
import React, { useState } from "react";

export default function SlideshowMaker() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      setError("Please select at least one image.");
      return;
    }
    setError(null);
    setLoading(true);
    setVideoUrl(null);

    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    try {
  const res = await fetch("http://127.0.0.1:8000/api/slideshow", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to generate slideshow.");
      const data = await res.json();
  // Always use absolute URL for video to avoid CORS issues
  setVideoUrl(`http://127.0.0.1:8000${data.video_url}`);
    } catch (err: any) {
      setError(err.message || "Error generating slideshow.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-4 w-full max-w-md" onSubmit={handleSubmit}>
      <label className="block text-gray-700">Upload Photos</label>
      <input
        type="file"
        name="slideshow-photos"
        accept="image/*"
        multiple
        className="block w-full text-gray-600"
        onChange={handleFileChange}
      />
      <button
        type="submit"
        className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-2 rounded-lg shadow transition mt-2"
        disabled={loading}
      >
        {loading ? "Making Slideshow..." : "Make My Slideshow"}
      </button>
      {error && <div className="text-red-600">{error}</div>}
      {videoUrl && (
        <div className="mt-6 w-full flex flex-col items-center">
          <video
            controls
            className="w-full max-w-md rounded-lg shadow-lg"
            src={videoUrl}
            crossOrigin="anonymous"
          ></video>
          <button
            type="button"
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded shadow"
            onClick={async () => {
              if (videoUrl) {
                try {
                  const response = await fetch(videoUrl, { mode: 'cors' });
                  const blob = await response.blob();
                  const url = window.URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = 'slideshow.mp4';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  window.URL.revokeObjectURL(url);
                } catch (err) {
                  alert('Failed to download video.');
                }
              }
            }}
          >
            Download Slideshow
          </button>
        </div>
      )}
    </form>
  );
}
