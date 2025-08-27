"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { SmartImage } from "./SmartImage";

// Seed list with human friendly labels + raw playlist IDs only; we will fetch live data.
const PLAYLIST_PRESETS: { id: string; fallbackLabel: string }[] = [
  { id: "37i9dQZF1DX0BcQWzuB7ZO", fallbackLabel: "Bachelorette Party" },
  { id: "37i9dQZF1DX1tW4VlEfDSS", fallbackLabel: "Gameday Hype" },
  { id: "37i9dQZF1DXaXB8fQg7xif", fallbackLabel: "Prom Night" },
  { id: "37i9dQZF1DXaKIA8E7WcJj", fallbackLabel: "Classic Party" },
];

interface PlaylistMeta {
  id: string;
  name: string;
  description: string;
  image?: string;
  url?: string;
  /** true if loaded from API */
  live?: boolean;
}

interface SearchResult {
  id: string;
  name: string;
  description: string;
  image?: string;
  url?: string;
}

const PlaylistStarter: React.FC = () => {
  const [playlists, setPlaylists] = useState<PlaylistMeta[]>(
    PLAYLIST_PRESETS.map(p => ({ id: p.id, name: p.fallbackLabel, description: "Loading…" }))
  );
  const [showForm, setShowForm] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({ label: "", url: "", cover: "", description: "" });
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const debounceRef = useRef<number | null>(null);
  const lastQueryRef = useRef<string>("");

  const fetchLive = useCallback(async () => {
    try {
      const res = await fetch("/api/spotify-playlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: PLAYLIST_PRESETS.map(p => p.id) }),
      });
      if (!res.ok) return;
      const json = await res.json();
      if (!json.ok) return;
      const mapped: PlaylistMeta[] = PLAYLIST_PRESETS.map(p => {
        const live = json.playlists?.[p.id];
        return {
          id: p.id,
          name: live?.name || p.fallbackLabel,
          description: live?.description || "",
          image: live?.image,
          url: live?.url || (live ? `https://open.spotify.com/playlist/${p.id}` : undefined),
          live: !!live,
        };
      });
      setPlaylists(mapped);
    } catch {/* ignore */}
  }, []);

  useEffect(() => { fetchLive(); }, [fetchLive]);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (!search.trim()) {
      setSearchResults(null);
      setSearchError("");
      return;
    }
    const q = search.trim();
    debounceRef.current = window.setTimeout(async () => {
      if (q.length < 2 || q === lastQueryRef.current) return;
      lastQueryRef.current = q;
      setSearchLoading(true);
      setSearchError("");
      try {
        const res = await fetch("/api/spotify-search", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ q }) });
        if (!res.ok) {
          setSearchError("Search failed.");
          setSearchResults([]);
        } else {
          const json = await res.json();
            if (!json.ok) {
              setSearchError(json.error || "Search error");
              setSearchResults([]);
            } else {
              setSearchResults(json.items as SearchResult[]);
            }
        }
      } catch {
        setSearchError("Network error.");
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 420);
    return () => { if (debounceRef.current) window.clearTimeout(debounceRef.current); };
  }, [search]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylist.label || !newPlaylist.url) {
      setError("Playlist name and link are required.");
      return;
    }
    const idMatch = newPlaylist.url.match(/playlist\/(\w+)/);
    const id = idMatch?.[1] || newPlaylist.url;
    setPlaylists(prev => [
      ...prev,
      {
        id,
        name: newPlaylist.label,
        description: newPlaylist.description || "User submitted playlist.",
        image: newPlaylist.cover || undefined,
        url: newPlaylist.url,
      }
    ]);
    setNewPlaylist({ label: "", url: "", cover: "", description: "" });
    setShowForm(false);
    setError("");
  };

  const handleAddFromSearch = (res: SearchResult) => {
    // Prevent duplicates
    if (playlists.some(p => p.id === res.id)) return;
    setPlaylists(prev => [...prev, { id: res.id, name: res.name, description: res.description, image: res.image, url: res.url, live: true }]);
  };

  const resetFeatured = () => {
    setSearch("");
    setSearchResults(null);
    fetchLive();
  };

  const FallbackSmartImage: React.FC<{ src?: string; alt: string; className?: string; initials: string; }> = ({ src, alt, className, initials }) => {
    const [err, setErr] = useState(false);
    if (!src || err) {
      return <div className={`w-20 h-20 mb-2 rounded-lg border-2 border-blue-100 bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center text-2xl text-blue-700 font-bold ${className || ''}`}>{initials}</div>;
    }
    return <SmartImage src={src} alt={alt} className={`w-20 h-20 rounded-lg mb-2 object-cover border-2 border-blue-100 ${className || ''}`} onError={() => setErr(true)} />;
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-200 rounded-2xl shadow-xl p-4 border-2 border-blue-400 w-full text-sm">
      <h3 className="text-xl font-extrabold mb-2 text-blue-900 tracking-tight drop-shadow text-center">Playlist Starter</h3>
      <p className="text-blue-900 mb-3 text-center">One-click Spotify playlists for every occasion. Search, play, or add your own!</p>
      <div className="flex flex-col md:flex-row gap-2 mb-4 items-stretch md:items-end">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-blue-800 mb-1">Search Spotify Playlists</label>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Type at least 2 characters..." className="w-full border border-blue-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div className="flex gap-2">
          <button onClick={resetFeatured} type="button" className="px-3 py-2 bg-white border border-blue-300 rounded-lg text-xs font-semibold text-blue-800 hover:bg-blue-50">Featured</button>
          {searchResults && (
            <button onClick={() => { setSearch(""); setSearchResults(null); }} type="button" className="px-3 py-2 bg-white border border-blue-300 rounded-lg text-xs font-semibold text-blue-800 hover:bg-blue-50">Clear</button>
          )}
        </div>
      </div>
      {searchLoading && <div className="text-xs text-blue-800 mb-2 animate-pulse">Searching…</div>}
      {searchError && <div className="text-xs text-red-600 mb-2">{searchError}</div>}
      {searchResults && (
        <div className="mb-6">
          <h4 className="text-sm font-bold text-blue-900 mb-2">Search Results</h4>
          {searchResults.length === 0 && <div className="text-xs text-blue-800">No playlists found.</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {searchResults.map(r => (
              <div key={r.id} className="bg-white rounded-xl shadow p-3 flex flex-col items-center border border-blue-200 relative">
                <FallbackSmartImage src={r.image} alt={r.name} initials={r.name.slice(0,2).toUpperCase()} />
                <div className="font-bold text-base text-blue-900 mb-1 text-center line-clamp-1" title={r.name}>{r.name}</div>
                <div className="text-blue-800 text-center text-xs mb-1 line-clamp-2 min-h-[2.25rem]" title={r.description}>{r.description}</div>
                <div className="flex gap-2 w-full">
                  {r.url && <a href={r.url} target="_blank" rel="noopener noreferrer" className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-bold px-3 py-1 rounded-lg shadow transition mb-1 text-center text-xs">Play</a>}
                  <button onClick={() => handleAddFromSearch(r)} className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow text-xs mb-1">Add</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
        {playlists.map(pl => (
          <div key={pl.id} className="bg-white rounded-xl shadow p-3 flex flex-col items-center border border-blue-200">
            <FallbackSmartImage src={pl.image} alt={pl.name} initials={pl.name.slice(0,2).toUpperCase()} />
            <div className="font-bold text-base text-blue-900 mb-1 text-center line-clamp-1" title={pl.name}>{pl.name}</div>
            <div className="text-blue-800 text-center text-xs mb-1 line-clamp-2 min-h-[2.25rem]" title={pl.description}>{pl.description || ""}</div>
            {pl.url ? (
              <a href={pl.url} target="_blank" rel="noopener noreferrer" className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-3 py-1 rounded-lg shadow transition mb-1 w-full text-center text-xs">Play on Spotify</a>
            ) : (
              <div className="bg-gray-300 text-gray-600 font-semibold px-3 py-1 rounded-lg mb-1 w-full text-center text-xs">Unavailable</div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-center mb-2">
        <button onClick={() => setShowForm((v) => !v)} className="bg-green-600 hover:bg-green-700 text-white font-bold px-3 py-1 rounded-lg shadow transition text-xs">
          {showForm ? "Cancel" : "Suggest a Playlist"}
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleAdd} className="bg-white rounded-xl shadow p-3 border border-blue-200 max-w-lg mx-auto flex flex-col gap-2 text-xs">
          <div>
            <label className="font-semibold text-blue-800">Playlist Name</label>
            <input type="text" className="border rounded px-2 py-1 w-full" value={newPlaylist.label} onChange={e => setNewPlaylist({ ...newPlaylist, label: e.target.value })} required />
          </div>
          <div>
            <label className="font-semibold text-blue-800">Spotify Link</label>
            <input type="url" className="border rounded px-2 py-1 w-full" value={newPlaylist.url} onChange={e => setNewPlaylist({ ...newPlaylist, url: e.target.value })} required placeholder="https://open.spotify.com/playlist/…" />
          </div>
          <div>
            <label className="font-semibold text-blue-800">Cover Image URL (optional)</label>
            <input type="url" className="border rounded px-2 py-1 w-full" value={newPlaylist.cover} onChange={e => setNewPlaylist({ ...newPlaylist, cover: e.target.value })} />
          </div>
          <div>
            <label className="font-semibold text-blue-800">Description (optional)</label>
            <input type="text" className="border rounded px-2 py-1 w-full" value={newPlaylist.description} onChange={e => setNewPlaylist({ ...newPlaylist, description: e.target.value })} />
          </div>
          {error && <div className="text-red-600 text-xs mb-1">{error}</div>}
          <button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-3 py-1 rounded-lg shadow transition mt-1 text-xs">Add Playlist</button>
        </form>
      )}
    </div>
  );
};

export default PlaylistStarter;
