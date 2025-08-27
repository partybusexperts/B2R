"use client";
import React, { useState, useEffect, useCallback } from 'react';
import OptimizedImage from './OptimizedImage';
import { ResolvedVehicle } from '../data/vehicles';

interface Props {
  vehicle: ResolvedVehicle;
  phoneTel?: string;
  email?: string;
  showCTA?: boolean;
  autoRotateMs?: number;
}

// Card showing primary image + selectable thumbnails (like party-buses page) but reusable
export const VehicleGalleryCard: React.FC<Props> = ({ vehicle, phoneTel='8885352566', email='info@bus2ride.com', showCTA=true, autoRotateMs=4500 }) => {
  const [idx, setIdx] = useState(0);
  const images = vehicle.images;
  const active = images[idx] || vehicle.primary || images[0];

  // Auto-rotate if multiple and user hasn't interacted recently
  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => {
      setIdx(prev => (prev + 1) % images.length);
    }, autoRotateMs);
    return () => clearInterval(id);
  }, [images.length, autoRotateMs]);

  const onThumbClick = useCallback((i:number) => setIdx(i), []);

  const categoryHref = (() => {
    switch (vehicle.category) {
      case 'party-buses': return '/party-buses';
      case 'limousines': return '/limousines';
      case 'coach-buses': return '/coach-buses';
      default: return '/fleet';
    }
  })();

  return (
    <div className="bg-[#15305f]/90 border border-blue-800/40 rounded-[24px] shadow-[0_10px_30px_rgba(2,6,23,.35)] overflow-hidden group focus-within:ring-2 focus-within:ring-blue-400/60">
      <div className="flex items-center justify-between px-6 pt-5 min-h-[28px]">
        <span className="text-xs font-semibold text-blue-100/90 capitalize">{vehicle.category.replace('-', ' ')}</span>
        {vehicle.badge ? (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white border border-blue-300/40">{vehicle.badge}</span>
        ) : <span className="h-[18px]" />}
      </div>

      <div className="px-6 mt-3">
        <a
          href={categoryHref}
          aria-label={`View all ${vehicle.category.replace('-', ' ')}`}
          className="relative block h-80 md:h-[22rem] w-full overflow-hidden rounded-2xl border border-blue-800/30 bg-[#18356e] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-400/60"
        >
          {active?.entry ? (
            <OptimizedImage
              entry={active.entry}
              alt={active.alt || vehicle.alt || vehicle.name}
              className="w-full h-full object-cover transition duration-700 ease-out group-hover:scale-[1.02]"
              sizesOverride="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
              minDesiredWidth={800}
            />
          ) : (
            <div className="text-blue-100/80">Image</div>
          )}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 bg-black/35 px-3 py-1.5 rounded-full backdrop-blur-sm">
              {images.map((img,i)=> (
                <button
                  key={img.file + i}
                  type="button"
                  onClick={() => onThumbClick(i)}
                  className={`relative h-9 w-12 overflow-hidden rounded-md border ${i===idx? 'border-blue-300 ring-2 ring-blue-400':'border-blue-800/50'}`}
                  aria-label={`Show image ${i+1} for ${vehicle.name}`}
                >
                  { (img.entry || active?.entry) && (
                    <OptimizedImage entry={img.entry || active!.entry!} alt="" className="h-full w-full object-cover" minDesiredWidth={200} />
                  )}
                </button>
              ))}
            </div>
          )}
        </a>
      </div>

      <div className="px-6 mt-5">
        <h3 className="text-xl md:text-2xl font-extrabold text-white tracking-tight text-center">
          <a href={categoryHref} className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400/60 rounded-sm">
            {vehicle.name}
          </a>
        </h3>
        <div className="mt-1 mb-2 text-center">
          <a href={categoryHref} className="text-[11px] uppercase tracking-wide font-semibold text-blue-300 hover:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400/60 rounded px-1">
            View {vehicle.category.replace('-', ' ')} →
          </a>
        </div>
        <div className="mt-1 mb-4 text-sm font-semibold text-blue-200 text-center">Seats up to {vehicle.capacityMax}</div>
        <ul className="text-blue-100/95 text-[0.85rem] md:text-[0.95rem] space-y-1 min-h-[60px]">
          {vehicle.highlights.slice(0,3).map(h => (
            <li key={h} className="flex items-start gap-2"><span className="mt-[2px]">•</span><span>{h}</span></li>
          ))}
        </ul>
      </div>

      {showCTA && (
        <div className="px-6 pb-6 pt-4">
          <div className="flex justify-between gap-3">
            <a href={`tel:${phoneTel}`} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-3 py-3 font-bold bg-blue-600 text-white hover:bg-blue-700 border border-blue-700 transition">Call</a>
            <a href={`mailto:${email}`} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-3 py-3 font-bold bg-blue-800 text-white hover:bg-blue-900 border border-blue-900 transition">Email</a>
            <a href="/quote#instant" className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-3 py-3 font-bold bg-white text-blue-900 hover:bg-blue-50 border border-blue-200 transition">Quote</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleGalleryCard;
