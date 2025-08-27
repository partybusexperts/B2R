"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { SmartImage } from "./SmartImage";

// ---- constants & helpers ----
const PLAYLIST_PRESETS: { id: string; fallbackLabel: string }[] = [
  { id: "37i9dQZF1DX0BcQWzuB7ZO", fallbackLabel: "Bachelorette Party" },
  { id: "37i9dQZF1DX1tW4VlEfDSS", fallbackLabel: "Gameday Hype" },
  { id: "37i9dQZF1DXaXB8fQg7xif", fallbackLabel: "Prom Night" },
  { id: "37i9dQZF1DXaKIA8E7WcJj", fallbackLabel: "Classic Party" },
];
const FALLBACK_LABEL_MAP: Record<string, string> = Object.fromEntries(
  PLAYLIST_PRESETS.map((p) => [p.id, p.fallbackLabel])
);
const looksLikeId = (s?: string) => !!s && /^[A-Za-z0-9]{22}$/.test(s);

interface PlaylistMeta {
  id: string;
  name: string;
  description: string;
  image?: string;
  url: string; // always present
  live?: boolean; // only true when API fetched live
  custom?: boolean;
  liveAttempted?: boolean; // NEW: we tried contacting API for this preset
}
interface SearchResult {
  id: string;
  name: string;
  description: string;
  image?: string;
  url?: string;
}

const STORAGE_KEY = "playlist_starter_custom_v1";

const PlaylistStarter: React.FC = () => {
  // ---- state ----
  const [playlists, setPlaylists] = useState<PlaylistMeta[]>(
    PLAYLIST_PRESETS.map((p) => ({
      id: p.id,
      name: p.fallbackLabel,
      description: "Loading…",
      url: `https://open.spotify.com/playlist/${p.id}`,
      live: false,
      custom: false,
      liveAttempted: false,
    }))
  );
  const [showForm, setShowForm] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({ label: "", url: "", cover: "", description: "" });
  const [error, setError] = useState("");
  const [fetchError, setFetchError] = useState<string>("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [health, setHealth] = useState<"checking" | "ok" | "missing" | "failed">("checking");
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const debounceRef = useRef<number | null>(null);
  const lastQueryRef = useRef<string>("");

  // ---- api: live fetch for presets ----
  const fetchLive = useCallback(async () => {
    try {
      const res = await fetch("/api/spotify-playlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: PLAYLIST_PRESETS.map((p) => p.id) }),
      });

      // mark attempt regardless of success so UI can decide when to show fallback badge
      const markAttempted = (arr: PlaylistMeta[]) =>
        arr.map((pl) =>
          PLAYLIST_PRESETS.some((p) => p.id === pl.id)
            ? { ...pl, liveAttempted: true }
            : pl
        );

      if (!res.ok) {
        setPlaylists((prev) => markAttempted(prev));
        setFetchError(`Playlist metadata request failed (${res.status}).`);
        return;
      }

      const json = await res.json();
      if (!json?.ok) {
        setPlaylists((prev) => markAttempted(prev));
        setFetchError(json?.error || "Spotify metadata error.");
        return;
      }

      const mapped: PlaylistMeta[] = PLAYLIST_PRESETS.map((p) => {
        const raw = json.playlists?.[p.id];
        const fetched = !!raw?.fetched;
        // Use human label if API returns a name that looks like an ID
        const safeName =
          !raw?.name || looksLikeId(raw.name) ? p.fallbackLabel : raw.name;

        // Build description (if API failed, show concise reason)
        let desc = fetched ? raw?.description || "" : "";
        if (!fetched && raw?.reason) {
          const reasonMap: Record<string, string> = {
            not_found_or_private: "Playlist is private or not found.",
            forbidden: "Access forbidden (possibly region locked).",
            exception: "Temporary error contacting Spotify.",
          };
          desc = reasonMap[raw.reason] || "Unavailable via API (link still works).";
        }

        return {
          id: p.id,
          name: safeName,
          description: desc,
          image: fetched ? raw?.image : undefined,
          url: raw?.url || `https://open.spotify.com/playlist/${p.id}`,
          live: fetched,
          custom: false,
          liveAttempted: true,
        };
      });

      setPlaylists((prev) => {
        const customs = prev.filter((p) => p.custom);
        return [...mapped, ...customs];
      });
      setFetchError("");
    } catch {
      // network error; still mark as attempted so Fallback can show truthfully
      setPlaylists((prev) =>
        prev.map((pl) =>
          PLAYLIST_PRESETS.some((p) => p.id === pl.id)
            ? { ...pl, liveAttempted: true }
            : pl
        )
      );
      setFetchError("Could not reach Spotify metadata endpoint.");
    }
  }, []);

  useEffect(() => {
    fetchLive();
  }, [fetchLive]);

  // ---- health ----
  useEffect(() => {
    type HealthShape = { ok?: boolean; auth?: string } | undefined;
    let cancelled = false;
    fetch("/api/spotify-health", { cache: "no-store" })
      .then((r) => r.json().catch(() => ({})))
      .then((j: HealthShape) => {
        if (cancelled) return;
        if (j?.ok) setHealth("ok");
        else if (j?.auth === "missing") setHealth("missing");
        else setHealth("failed");
      })
      .catch(() => !cancelled && setHealth("failed"));
    return () => {
      cancelled = true;
    };
  }, []);

  // ---- custom playlists persistence ----
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        const parsed = JSON.parse(raw) as PlaylistMeta[];
        if (Array.isArray(parsed)) {
          setPlaylists((prev) => {
            const existing = new Set(prev.map((p) => p.id));
            const toAdd = parsed
              .filter((p) => p && p.id && !existing.has(p.id))
              .map((p) => ({
                ...p,
                custom: true,
                url: p.url || `https://open.spotify.com/playlist/${p.id}`,
                live: !!p.live,
              }));
            return [...prev, ...toAdd];
          });
        }
      }
    } catch {/* ignore */}
  }, []);

  useEffect(() => {
    try {
      const customs = playlists.filter((p) => p.custom);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(customs));
      }
    } catch {/* ignore */}
  }, [playlists]);

  // ---- debounced search ----
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);

    if (health !== "ok") {
      setSearchResults(null);
      setSearchError(health === "checking" ? "" : "Search disabled: server missing/invalid Spotify credentials.");
      return;
    }
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
        const res = await fetch("/api/spotify-search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ q }),
        });
        const json = await res.json().catch(() => null);
        if (!res.ok || !json?.ok) {
          setSearchError(json?.error || `Search failed (${res.status}).`);
          setSearchResults([]);
        } else {
          // Filter only valid items with a real 22-char id
          const items: SearchResult[] = (json.items || [])
            .filter((it: any) => looksLikeId(it?.id))
            .map((it: any) => ({
              id: it.id,
              name: looksLikeId(it.name) ? (FALLBACK_LABEL_MAP[it.id] || it.name) : (it.name || "Untitled"),
              description: it.description || "",
              image: Array.isArray(it.images) && it.images[0]?.url ? it.images[0].url : (it.image || undefined),
              url: it.url || (it.id ? `https://open.spotify.com/playlist/${it.id}` : undefined),
            }));
          setSearchResults(items);
        }
      } catch {
        setSearchError("Network error contacting search endpoint.");
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 420);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [search, health]);

  // re-run search when health flips to ok
  useEffect(() => {
    if (health === "ok" && search.trim().length >= 2) {
      lastQueryRef.current = "";
      setSearch((s) => s + "");
    }
  }, [health]);

  // ---- actions ----
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylist.label || !newPlaylist.url) {
      setError("Playlist name and link are required.");
      return;
    }
    const idMatch = newPlaylist.url.match(/playlist\/([A-Za-z0-9]{22})/);
    const id = idMatch?.[1];
    if (!id) {
      setError("That doesn’t look like a valid Spotify playlist URL.");
      return;
    }
    const next: PlaylistMeta = {
      id,
      name: newPlaylist.label,
      description: newPlaylist.description || "User submitted playlist.",
      image: newPlaylist.cover || undefined,
      url: `https://open.spotify.com/playlist/${id}`,
      custom: true,
      live: false,
    };
    setPlaylists((prev) => [...prev, next]);
    setNewPlaylist({ label: "", url: "", cover: "", description: "" });
    setShowForm(false);
    setError("");
    setJustAddedId(id);
    window.setTimeout(() => setJustAddedId(null), 1400);
  };

  const handleAddFromSearch = (res: SearchResult) => {
    if (!looksLikeId(res?.id)) return; // guard
    if (playlists.some((p) => p.id === res.id)) {
      setJustAddedId(res.id);
      window.setTimeout(() => setJustAddedId(null), 1000);
      return;
    }
    const next: PlaylistMeta = {
      id: res.id,
      name: res.name || "Untitled",
      description: res.description || "",
      image: res.image,
      url: res.url || `https://open.spotify.com/playlist/${res.id}`,
      custom: true,
      live: true,
    };
    setPlaylists((prev) => [...prev, next]);
    setJustAddedId(res.id);
    window.setTimeout(() => setJustAddedId(null), 1400);
  };

  const handleRemove = (id: string) => {
    setPlaylists((prev) => prev.filter((p) => !(p.id === id && p.custom)));
  };

  const handleMove = (id: string, dir: -1 | 1) => {
    setPlaylists((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      if (idx === -1 || !prev[idx].custom) return prev;
      const dest = idx + dir;
      if (dest < 0 || dest >= prev.length) return prev;
      // don't move into preset region
      const presetIds = new Set(PLAYLIST_PRESETS.map((p) => p.id));
      if (dir === -1 && presetIds.has(prev[dest].id)) return prev;
      const copy = [...prev];
      const [item] = copy.splice(idx, 1);
      copy.splice(dest, 0, item);
      return copy;
    });
  };

  const togglePreview = (id: string) => {
    setPlaylists((prev) => {
      // handled via separate state earlier, but we can keep simple UI:
      return prev; // preview handled by a simple local state below if needed
    });
    // we’ll keep the same preview pattern you had:
    // (preserve behavior: single preview at a time)
    setPreviewId((p) => (p === id ? null : id));
  };
  const [previewId, setPreviewId] = useState<string | null>(null);

  // ---- visuals: resilient image ----
  const FallbackSmartImage: React.FC<{ src?: string; alt: string; initials: string }> = ({
    src,
    alt,
    initials,
  }) => {
    const [err, setErr] = useState(false);
    if (!src || err) {
      return (
        <div
          className="w-20 h-20 mb-2 rounded-lg border-2 border-blue-100 bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center text-2xl text-blue-700 font-bold"
          aria-label={alt}
        >
          {initials}
        </div>
      );
    }
    return (
      <SmartImage
        src={src}
        alt={alt}
        className="w-20 h-20 rounded-lg mb-2 object-cover border-2 border-blue-100"
        onError={() => setErr(true)}
      />
    );
  };

  const SPOTIFY_ENABLED = health === "ok";

  // ---- render ----
  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-200 rounded-2xl shadow-xl p-4 border-2 border-blue-400 w-full text-sm">
      <h3 className="text-xl font-extrabold mb-2 text-blue-900 tracking-tight drop-shadow text-center">
        Playlist Starter
      </h3>
      <p className="text-blue-900 mb-3 text-center">
        One-click Spotify playlists for every occasion. Search, play, or add your own!
      </p>

      {fetchError && (
        <div className="mb-4 text-xs bg-rose-100 border border-rose-300 text-rose-800 px-3 py-2 rounded-lg">
          {fetchError}
        </div>
      )}

      {/* Search */}
      {SPOTIFY_ENABLED ? (
        <div className="flex flex-col md:flex-row gap-2 mb-4 items-stretch md:items-end">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-blue-800 mb-1">
              Search Spotify Playlists
            </label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type at least 2 characters..."
              className="w-full border border-blue-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSearch("");
                setSearchResults(null);
                setSearchError("");
                fetchLive();
              }}
              type="button"
              className="px-3 py-2 bg-white border border-blue-300 rounded-lg text-xs font-semibold text-blue-800 hover:bg-blue-50"
            >
              Featured
            </button>
            {searchResults && (
              <button
                onClick={() => {
                  setSearch("");
                  setSearchResults(null);
                  setSearchError("");
                  lastQueryRef.current = ""; // allow re-search of same query after clearing
                }}
                type="button"
                className="px-3 py-2 bg-white border border-blue-300 rounded-lg text-xs font-semibold text-blue-800 hover:bg-blue-50"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="mb-4 text-xs bg-amber-50 border border-amber-300 text-amber-800 px-3 py-2 rounded-lg">
          Search is disabled because Spotify credentials are missing or invalid.
        </div>
      )}

      {searchLoading && (
        <div className="text-xs text-blue-800 mb-2 animate-pulse">Searching…</div>
      )}
      {searchError && <div className="text-xs text-red-600 mb-2">{searchError}</div>}

      {SPOTIFY_ENABLED && searchResults && (
        <div className="mb-6">
          <h4 className="text-sm font-bold text-blue-900 mb-2">Search Results</h4>
          {searchResults.length === 0 && (
            <div className="text-xs text-blue-800">No playlists found.</div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {searchResults.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-xl shadow p-3 flex flex-col items-center border border-blue-200 relative"
              >
                <FallbackSmartImage
                  src={r.image}
                  alt={r.name}
                  initials={(r.name || "??").slice(0, 2).toUpperCase()}
                />
                <div
                  className="font-bold text-base text-blue-900 mb-1 text-center line-clamp-1"
                  title={r.name}
                >
                  {r.name}
                </div>
                <div
                  className="text-blue-800 text-center text-xs mb-1 line-clamp-2 min-h-[2.25rem]"
                  title={r.description}
                >
                  {r.description}
                </div>
                <div className="flex gap-2 w-full">
                  {r.url ? (
                    <>
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-bold px-3 py-1 rounded-lg shadow transition mb-1 text-center text-xs"
                        title="Open in Spotify"
                      >
                        Play
                      </a>
                      <button
                        onClick={() => handleAddFromSearch(r)}
                        className={`px-3 py-1 rounded-lg shadow text-xs mb-1 font-bold transition ${
                          justAddedId === r.id
                            ? "bg-green-600 text-white"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white"
                        }`}
                      >
                        {justAddedId === r.id ? "Added ✓" : "Add"}
                      </button>
                    </>
                  ) : (
                    // No play link — make Add fill the row to keep alignment consistent
                    <button
                      onClick={() => handleAddFromSearch(r)}
                      className={`flex-1 px-3 py-1 rounded-lg shadow text-xs mb-1 font-bold transition ${
                        justAddedId === r.id
                          ? "bg-green-600 text-white"
                          : "bg-indigo-600 hover:bg-indigo-700 text-white"
                      }`}
                    >
                      {justAddedId === r.id ? "Added ✓" : "Add"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Presets + Customs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
        {playlists.map((pl) => {
          const isPreset = PLAYLIST_PRESETS.some((p) => p.id === pl.id);
          const displayName = looksLikeId(pl.name) ? (FALLBACK_LABEL_MAP[pl.id] || pl.name) : pl.name;

          return (
            <div
              key={pl.id}
              className="bg-white rounded-xl shadow p-3 flex flex-col items-center border border-blue-200 relative"
            >
              {/* Custom controls */}
              {pl.custom && (
                <div className="absolute top-1 right-1 flex gap-1">
                  <button
                    aria-label="Remove"
                    onClick={() => handleRemove(pl.id)}
                    className="text-[10px] px-1 py-0.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded"
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              )}

              <FallbackSmartImage
                src={pl.image}
                alt={displayName}
                initials={displayName.slice(0, 2).toUpperCase()}
              />
              <div
                className="font-bold text-base text-blue-900 mb-1 text-center line-clamp-1"
                title={displayName}
              >
                {displayName}
              </div>
              <div
                className="text-blue-800 text-center text-xs mb-1 line-clamp-2 min-h-[2.25rem]"
                title={pl.description}
              >
                {pl.description || ""}
              </div>

              <div className="flex flex-col w-full gap-1">
                <div className="flex gap-2 w-full">
                  <a
                    href={pl.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-bold px-3 py-1 rounded-lg shadow transition text-center text-xs"
                    title="Open in Spotify"
                  >
                    Open
                  </a>
                  <button
                    onClick={() => setPreviewId((p) => (p === pl.id ? null : pl.id))}
                    className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow text-xs"
                  >
                    {previewId === pl.id ? "Hide" : "Preview"}
                  </button>
                </div>

                {previewId === pl.id && pl.id && (
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

                {/* Fallback badge: show ONLY for presets after a live attempt that returned no live data */}
                {isPreset && pl.liveAttempted && !pl.live && (
                  <div className="text-[10px] text-amber-700 text-center">Fallback (API data unavailable)</div>
                )}
                {isPreset && pl.live && (
                  <div className="text-[10px] text-green-700 text-center">Live ✓</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-[10px] text-center text-blue-700 mb-2">
        Spotify status: {health === "checking" ? "…" : health}
      </div>

      {/* Suggest form */}
      <div className="flex justify-center mb-2">
        <button
          onClick={() => setShowForm((v) => !v)}
          className="bg-green-600 hover:bg-green-700 text-white font-bold px-3 py-1 rounded-lg shadow transition text-xs"
        >
          {showForm ? "Cancel" : "Suggest a Playlist"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleAdd}
          className="bg-white rounded-xl shadow p-3 border border-blue-200 max-w-lg mx-auto flex flex-col gap-2 text-xs"
        >
          <div>
            <label className="font-semibold text-blue-800">Playlist Name</label>
            <input
              type="text"
              className="border rounded px-2 py-1 w-full"
              value={newPlaylist.label}
              onChange={(e) => setNewPlaylist({ ...newPlaylist, label: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="font-semibold text-blue-800">Spotify Link</label>
            <input
              type="url"
              className="border rounded px-2 py-1 w-full"
              value={newPlaylist.url}
              onChange={(e) => setNewPlaylist({ ...newPlaylist, url: e.target.value })}
              required
              placeholder="https://open.spotify.com/playlist/…"
            />
          </div>
          <div>
            <label className="font-semibold text-blue-800">Cover Image URL (optional)</label>
            <input
              type="url"
              className="border rounded px-2 py-1 w-full"
              value={newPlaylist.cover}
              onChange={(e) => setNewPlaylist({ ...newPlaylist, cover: e.target.value })}
            />
          </div>
          <div>
            <label className="font-semibold text-blue-800">Description (optional)</label>
            <input
              type="text"
              className="border rounded px-2 py-1 w-full"
              value={newPlaylist.description}
              onChange={(e) => setNewPlaylist({ ...newPlaylist, description: e.target.value })}
            />
          </div>
          {error && <div className="text-red-600 text-xs mb-1">{error}</div>}
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-3 py-1 rounded-lg shadow transition mt-1 text-xs"
          >
            Add Playlist
          </button>
        </form>
      )}
    </div>
  );
};

export default PlaylistStarter;
