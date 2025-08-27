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
const FALLBACK_LABEL_MAP: Record<string,string> = PLAYLIST_PRESETS.reduce((acc,p)=>{acc[p.id]=p.fallbackLabel;return acc;},{} as Record<string,string>);
const looksLikeRawId = (val: string|undefined) => !!val && /^[A-Za-z0-9]{22}$/.test(val);

interface PlaylistMeta {
  id: string;
  name: string;
  description: string;
  image?: string;
  url?: string;
  /** true if loaded from API */
  live?: boolean;
  /** user-added custom playlist */
  custom?: boolean;
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
  const [fetchError, setFetchError] = useState<string>("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [health, setHealth] = useState<'checking'|'ok'|'missing'|'failed'>('checking');
  const debounceRef = useRef<number | null>(null);
  const lastQueryRef = useRef<string>("");
  const [previewId, setPreviewId] = useState<string | null>(null);

  const STORAGE_KEY = 'playlist_starter_custom_v1';

  const fetchLive = useCallback(async () => {
    try {
      const res = await fetch("/api/spotify-playlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: PLAYLIST_PRESETS.map(p => p.id) }),
      });
      if (!res.ok) {
        setFetchError("Playlist metadata request failed (" + res.status + "). Check credentials.");
        return;
      }
      const json = await res.json();
      if (!json.ok) {
        setFetchError(json.error || "Spotify metadata error. Add SPOTIFY_CLIENT_ID/SECRET and restart.");
        return;
      }
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
      // Preserve custom playlists (and order) when updating presets
      setPlaylists(prev => {
        const customs = prev.filter(p => p.custom);
        return [...mapped, ...customs];
      });
      setFetchError("");
    } catch {/* ignore */}
  }, []);

  useEffect(() => { fetchLive(); }, [fetchLive]);

  // Health check once (helps user know why images/names missing)
  useEffect(() => {
    let cancelled=false;
    fetch('/api/spotify-health', { cache: 'no-store' })
      .then(r=>r.json().catch(()=>({})))
      .then((j:any)=>{ if(cancelled) return; if(j?.ok){ setHealth('ok'); } else if(j?.auth==='missing'){ setHealth('missing'); } else { setHealth('failed'); } })
      .catch(()=>{ if(!cancelled) setHealth('failed'); });
    return ()=>{cancelled=true};
  }, []);

  // Load custom playlists from localStorage (once on mount)
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        const parsed = JSON.parse(raw) as PlaylistMeta[];
        if (Array.isArray(parsed)) {
          setPlaylists(prev => {
            const existing = new Set(prev.map(p => p.id));
            const toAdd = parsed.filter(p => p && p.id && !existing.has(p.id)).map(p => ({ ...p, custom: true }));
            return [...prev, ...toAdd];
          });
        }
      }
    } catch {/* ignore */}
  }, []);

  // Persist custom playlists when they change
  useEffect(() => {
    try {
      const customs = playlists.filter(p => p.custom);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(customs));
      }
    } catch {/* ignore */}
  }, [playlists]);

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
        const status = res.status;
        let json: unknown = null;
        try { json = await res.json(); } catch { /* ignore parse */ }
        const obj = json as { ok?: boolean; error?: string } | null;
        if (!res.ok || !obj?.ok) {
          if (obj?.error === "spotify_auth_failed") {
            setSearchError("Server missing Spotify credentials. Add SPOTIFY_CLIENT_ID + SECRET and restart.");
          } else if (status === 502) {
            setSearchError("Spotify search service error (502). Try again.");
          } else if (status === 400) {
            setSearchError("Query too short.");
          } else {
            setSearchError(obj?.error || "Search failed.");
          }
          setSearchResults([]);
        } else {
          const success = json as { items?: SearchResult[] };
          const mapped = (success.items || []).map(it => ({
            ...it,
            // If API somehow returned raw ID as name, use preset fallback if available
            name: looksLikeRawId(it.name) ? (FALLBACK_LABEL_MAP[it.id] || it.name) : it.name,
            url: it.url || (it.id ? `https://open.spotify.com/playlist/${it.id}` : undefined)
          }));
          setSearchResults(mapped);
        }
      } catch {
        setSearchError("Network error contacting search endpoint.");
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
  const idMatch = newPlaylist.url.match(/playlist\/([A-Za-z0-9]{10,})/); // base62 length usually 22
    const id = idMatch?.[1] || newPlaylist.url;
    setPlaylists(prev => [
      ...prev,
      {
        id,
        name: newPlaylist.label,
        description: newPlaylist.description || "User submitted playlist.",
        image: newPlaylist.cover || undefined,
        url: newPlaylist.url,
        custom: true,
      }
    ]);
    setNewPlaylist({ label: "", url: "", cover: "", description: "" });
    setShowForm(false);
    setError("");
  };

  const handleAddFromSearch = (res: SearchResult) => {
    // Prevent duplicates
    if (playlists.some(p => p.id === res.id)) return;
    setPlaylists(prev => [...prev, { id: res.id, name: res.name, description: res.description, image: res.image, url: res.url, live: true, custom: true }]);
  };

  const resetFeatured = () => {
    setSearch("");
    setSearchResults(null);
    fetchLive();
  };

  const handleRemove = (id: string) => {
    setPlaylists(prev => prev.filter(p => p.id !== id || !p.custom));
    if (previewId === id) setPreviewId(null);
  };

  const handleMove = (id: string, dir: -1 | 1) => {
    setPlaylists(prev => {
      const idx = prev.findIndex(p => p.id === id);
      if (idx === -1) return prev;
      const item = prev[idx];
      if (!item.custom) return prev; // only allow reordering custom items
      const targetIdx = idx + dir;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      // disallow swapping into preset zone if moving up
      const presetIds = new Set(PLAYLIST_PRESETS.map(p => p.id));
      if (dir === -1 && presetIds.has(prev[targetIdx].id)) return prev;
      const copy = [...prev];
      copy.splice(idx, 1);
      copy.splice(targetIdx, 0, item);
      return copy;
    });
  };

  const togglePreview = (id: string) => {
    setPreviewId(p => p === id ? null : id);
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
      {fetchError && (
        <div className="mb-4 text-xs bg-rose-100 border border-rose-300 text-rose-800 px-3 py-2 rounded-lg">
          {fetchError} — Make sure <code className="font-mono">SPOTIFY_CLIENT_ID</code> and <code className="font-mono">SPOTIFY_CLIENT_SECRET</code> are in <code>.env.local</code> then restart (they are server-only).
        </div>
      )}
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
                <FallbackSmartImage src={r.image} alt={r.name} initials={(r.name||'??').slice(0,2).toUpperCase()} />
                <div className="font-bold text-base text-blue-900 mb-1 text-center line-clamp-1" title={r.name}>{r.name}</div>
                <div className="text-blue-800 text-center text-xs mb-1 line-clamp-2 min-h-[2.25rem]" title={r.description}>{r.description}</div>
                <div className="flex gap-2 w-full">
                  {r.url && <a href={r.url} target="_blank" rel="noopener noreferrer" className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-bold px-3 py-1 rounded-lg shadow transition mb-1 text-center text-xs" title="Open in Spotify">Play</a>}
                  <button onClick={() => handleAddFromSearch(r)} className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow text-xs mb-1">Add</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
  {playlists.map(pl => {
          const isCustom = !!pl.custom;
      const isPreset = PLAYLIST_PRESETS.some(p => p.id === pl.id);
    // If the "name" is just the 22-char base62 ID, prefer our friendly fallback label.
    const displayName = looksLikeRawId(pl.name) ? (FALLBACK_LABEL_MAP[pl.id] || pl.name) : pl.name;
          return (
            <div key={pl.id} className="bg-white rounded-xl shadow p-3 flex flex-col items-center border border-blue-200 relative">
              {isCustom && (
                <div className="absolute top-1 right-1 flex gap-1">
                  <button aria-label="Move up" onClick={() => handleMove(pl.id, -1)} className="text-[10px] px-1 py-0.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded" title="Move Up">▲</button>
                  <button aria-label="Move down" onClick={() => handleMove(pl.id, 1)} className="text-[10px] px-1 py-0.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded" title="Move Down">▼</button>
                  <button aria-label="Remove" onClick={() => handleRemove(pl.id)} className="text-[10px] px-1 py-0.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded" title="Remove">✕</button>
                </div>
              )}
        <FallbackSmartImage src={pl.image} alt={displayName} initials={displayName.slice(0,2).toUpperCase()} />
        <div className="font-bold text-base text-blue-900 mb-1 text-center line-clamp-1" title={displayName}>{displayName}</div>
              <div className="text-blue-800 text-center text-xs mb-1 line-clamp-2 min-h-[2.25rem]" title={pl.description}>{pl.description || ""}</div>
              <div className="flex flex-col w-full gap-1">
        {pl.url ? (
                  <div className="flex gap-2 w-full">
          <a href={pl.url} target="_blank" rel="noopener noreferrer" className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-bold px-3 py-1 rounded-lg shadow transition text-center text-xs" title="Open in Spotify">Open</a>
                    <button onClick={() => togglePreview(pl.id)} className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow text-xs">{previewId === pl.id ? 'Hide' : 'Preview'}</button>
                  </div>
                ) : (
                  <div className="bg-gray-300 text-gray-600 font-semibold px-3 py-1 rounded-lg w-full text-center text-xs">Unavailable</div>
                )}
                {previewId === pl.id && pl.url && (
                  <div className="w-full animate-fade-in">
                    <iframe
                      src={`https://open.spotify.com/embed/playlist/${pl.id}?utm_source=generator`}
                      width="100%"
                      height="80"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      className="rounded"
          title={`Spotify preview ${displayName}`}
                    />
                  </div>
                )}
                {isPreset && !pl.live && (
                  <div className="text-[10px] text-blue-700 text-center">(Loading live data…)</div>
                )}
                {isPreset && pl.live && (
                  <div className="text-[10px] text-green-700 text-center">Live ✓</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="text-[10px] text-center text-blue-700 mb-2">Spotify status: {health==='checking'?'…':health}</div>
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
