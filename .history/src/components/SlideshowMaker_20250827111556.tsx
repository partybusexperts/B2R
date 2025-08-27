"use client";
import React, { useState, useEffect } from "react";

export default function SlideshowMaker() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Stable share URL to avoid hydration mismatch: start with hash placeholder (same server + client), then enhance after mount
  const [shareUrl, setShareUrl] = useState('#slideshow-tool');
  const encodedUrl = encodeURIComponent(shareUrl);

  useEffect(() => {
    try {
      const full = window.location.origin + window.location.pathname + '#slideshow-tool';
      setShareUrl(full);
    } catch { /* no-op */ }
  }, []);

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
    <form id="slideshow-tool" className="flex flex-col gap-4 w-full max-w-md" onSubmit={handleSubmit}>
      <div className="flex items-center gap-3 mb-1" style={{ alignSelf: 'flex-start' }}>
        {/* Social Share Icons */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on Facebook"
          className="hover:text-blue-700"
        >
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
        </a>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=Check%20out%20my%20slideshow!`}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on X (Twitter)"
          className="hover:text-blue-700"
        >
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 5.924c.017.24.017.48.017.72 0 7.34-5.59 15.8-15.8 15.8-3.14 0-6.07-.92-8.54-2.51.44.05.87.08 1.32.08 2.61 0 5.01-.89 6.93-2.39-2.44-.05-4.5-1.66-5.21-3.88.34.06.68.1 1.04.1.5 0 .99-.07 1.45-.19-2.55-.51-4.47-2.77-4.47-5.48v-.07c.75.42 1.61.67 2.53.7-1.5-1-2.48-2.7-2.48-4.62 0-1.02.27-1.98.74-2.8 2.7 3.3 6.74 5.47 11.3 5.7-.09-.41-.14-.84-.14-1.28 0-3.09 2.5-5.6 5.6-5.6 1.61 0 3.07.68 4.09 1.77 1.27-.25 2.47-.71 3.55-1.34-.42 1.3-1.3 2.39-2.45 3.08 1.13-.13 2.21-.44 3.21-.89-.75 1.12-1.7 2.1-2.8 2.88z"/></svg>
        </a>
        <a
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on LinkedIn"
          className="hover:text-blue-700"
        >
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11.75 20h-3v-10h3v10zm-1.5-11.25c-.97 0-1.75-.78-1.75-1.75s.78-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.75-1.75 1.75zm15.25 11.25h-3v-5.5c0-1.32-.03-3-1.83-3-1.83 0-2.11 1.43-2.11 2.9v5.6h-3v-10h2.89v1.36h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v5.59z"/></svg>
        </a>
      </div>
      <a
        href="#slideshow-tool"
        className="text-blue-700 underline text-sm mb-1"
        title="Copy or share this link to jump to the slideshow tool!"
        style={{ alignSelf: 'flex-start' }}
      >
        Link to Slideshow Tool
      </a>
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
