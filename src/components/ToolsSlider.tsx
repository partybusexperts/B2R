import React from "react";
import { useRef, useLayoutEffect, useState } from "react";
import CapacityFinderTool from '../components/CapacityFinderTool';
import VehicleComparisonTool from '../components/VehicleComparisonTool';
import BudgetEstimator from '../components/BudgetEstimator';
import PlaylistStarter from '../components/PlaylistStarter';
import TailgateChecklist from '../components/TailgateChecklist';

export default function ToolsSlider() {
  const [current, setCurrent] = useState(0);
  const cards = [
    {
      title: 'Vehicle Capacity Finder',
      icon: '🚌',
      desc: 'Enter your group size to see the best vehicle options for your trip.',
      component: <CapacityFinderTool />,
    },
    {
      title: 'Vehicle Comparison Tool',
      icon: '⚖️',
      desc: 'Compare vehicle types side by side. Select two to see details.',
      component: <VehicleComparisonTool />,
    },
    {
      title: 'Budget Estimator',
      icon: '💰',
      desc: 'Get an estimate for your trip.',
      component: <BudgetEstimator />,
    },
    {
      title: 'Playlist Starter',
      icon: '🎶',
      desc: 'One-click Spotify playlists for every occasion. Preview, play, or add your own!',
      component: <PlaylistStarter />,
    },
    {
      title: 'Tailgate Checklist',
      icon: '🏈',
      desc: 'Cooler, ice, chargers, playlist, permission rules—everything you need for the ultimate tailgate.',
      component: <TailgateChecklist />,
    },
  ];
  const visible = 1; // Show 1 card at a time (can make 2 or 3 for desktop)
  const total = cards.length;

  // Infinite wrap-around logic
  const goPrev = () => setCurrent((c) => (c - 1 + total) % total);
  const goNext = () => setCurrent((c) => (c + 1) % total);

  return (
    <div className="relative max-w-full mx-auto">
      <button
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-blue-700 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-blue-800 transition"
        onClick={goPrev}
        aria-label="Previous tool"
        style={{ left: '-2.5rem' }}
      >
        &lt;
      </button>
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 gap-8"
          style={{ transform: `translateX(-${current * 340}px)` }}
        >
          {cards.map((card) => (
            <div
              key={card.title}
              className="tool-card bg-[#e0eaff] rounded-[15px] p-4 shadow-lg flex flex-col min-w-[320px] max-w-[340px] mx-auto items-stretch"
              style={{ flex: '0 0 340px', justifyContent: 'flex-start' }}
            >
              <h3 className="tool-title text-blue-900 text-xl font-bold mb-2 flex items-center gap-2">
                <span className="text-2xl">{card.icon}</span> {card.title}
              </h3>
              <p className="tool-description text-gray-600 mb-3 text-base">{card.desc}</p>
              <div>
                {card.component}
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-blue-700 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-blue-800 transition"
        onClick={goNext}
        aria-label="Next tool"
        style={{ right: '-2.5rem' }}
      >
        &gt;
      </button>
      {/* Dots navigation */}
      <div className="flex justify-center gap-2 mt-4">
        {cards.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full ${current === idx ? 'bg-blue-700' : 'bg-blue-200'}`}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to tool ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
