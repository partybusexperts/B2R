"use client";
import React, { useState } from "react";

const defaultPlaylists = [
  {
    label: "Bachelorette Party",
    url: "https://open.spotify.com/playlist/37i9dQZF1DX0BcQWzuB7ZO",
    cover: "https://i.scdn.co/image/ab67706f00000002b8e2e6e2e2e2e2e2e2e2e2e2",
    description: "Ultimate fun for your bachelorette night!"
  },
  {
    label: "Gameday Hype",
    url: "https://open.spotify.com/playlist/37i9dQZF1DX1tW4VlEfDSS",
    cover: "https://i.scdn.co/image/ab67706f00000002e2e2e2e2e2e2e2e2e2e2e2e2e2e2",
    description: "Get pumped for the big game."
  },
  {
    label: "Prom Night",
    url: "https://open.spotify.com/playlist/37i9dQZF1DXaXB8fQg7xif",
    cover: "https://i.scdn.co/image/ab67706f00000002e2e2e2e2e2e2e2e2e2e2e2e2e2e2",
    description: "Dance all night with these prom hits."
  },
  {
    label: "Classic Party",
    url: "https://open.spotify.com/playlist/37i9dQZF1DXaKIA8E7WcJj",
    cover: "https://i.scdn.co/image/ab67706f00000002e2e2e2e2e2e2e2e2e2e2e2e2e2e2",
    description: "Timeless party anthems for any crowd."
  }
];

const PlaylistStarter: React.FC = () => {
  const [playlists, setPlaylists] = useState(defaultPlaylists);
  const [showForm, setShowForm] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({ label: "", url: "", cover: "", description: "" });
  const [error, setError] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylist.label || !newPlaylist.url) {
      setError("Playlist name and link are required.");
      return;
    }
    setPlaylists((prev) => [
      ...prev,
      { ...newPlaylist, cover: newPlaylist.cover || "https://i.scdn.co/image/ab67706f00000002e2e2e2e2e2e2e2e2e2e2e2e2e2e2", description: newPlaylist.description || "User submitted playlist." }
    ]);
    setNewPlaylist({ label: "", url: "", cover: "", description: "" });
    setShowForm(false);
    setError("");
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-200 rounded-2xl shadow-xl p-10 border-2 border-blue-400 w-full">
      <h3 className="text-3xl font-extrabold mb-3 text-blue-900 tracking-tight drop-shadow text-center">Playlist Starter</h3>
      <p className="text-lg text-blue-900 mb-6 text-center">One-click Spotify playlists for every occasion. Preview, play, or add your own!</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {playlists.map((pl, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow p-6 flex flex-col items-center border border-blue-200">
            <img src={pl.cover} alt={pl.label} className="w-28 h-28 rounded-lg mb-3 object-cover border-2 border-blue-100" />
            <div className="font-bold text-lg text-blue-900 mb-1 text-center">{pl.label}</div>
            <div className="text-blue-800 text-center text-base mb-2">{pl.description}</div>
            <a href={pl.url} target="_blank" rel="noopener noreferrer" className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-2 rounded-lg shadow transition mb-2 w-full text-center">Play on Spotify</a>
          </div>
        ))}
      </div>
      <div className="flex justify-center mb-4">
        <button onClick={() => setShowForm((v) => !v)} className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-lg shadow transition">
          {showForm ? "Cancel" : "Suggest a Playlist"}
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleAdd} className="bg-white rounded-xl shadow p-6 border border-blue-200 max-w-lg mx-auto flex flex-col gap-3">
          <div>
            <label className="font-semibold text-blue-800">Playlist Name</label>
            <input type="text" className="border rounded px-3 py-2 w-full" value={newPlaylist.label} onChange={e => setNewPlaylist({ ...newPlaylist, label: e.target.value })} required />
          </div>
          <div>
            <label className="font-semibold text-blue-800">Spotify Link</label>
            <input type="url" className="border rounded px-3 py-2 w-full" value={newPlaylist.url} onChange={e => setNewPlaylist({ ...newPlaylist, url: e.target.value })} required />
          </div>
          <div>
            <label className="font-semibold text-blue-800">Cover Image URL (optional)</label>
            <input type="url" className="border rounded px-3 py-2 w-full" value={newPlaylist.cover} onChange={e => setNewPlaylist({ ...newPlaylist, cover: e.target.value })} />
          </div>
          <div>
            <label className="font-semibold text-blue-800">Description (optional)</label>
            <input type="text" className="border rounded px-3 py-2 w-full" value={newPlaylist.description} onChange={e => setNewPlaylist({ ...newPlaylist, description: e.target.value })} />
          </div>
          {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
          <button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-2 rounded-lg shadow transition mt-2">Add Playlist</button>
        </form>
      )}
    </div>
  );
};

export default PlaylistStarter;
