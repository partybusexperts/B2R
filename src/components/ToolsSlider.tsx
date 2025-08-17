import React, { useRef, useLayoutEffect, useState } from "react";
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
  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 text-blue-700 border border-blue-700 rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-blue-800 hover:text-white transition"
        onClick={goPrev}
        aria-label="Previous tool"
        style={{ left: '-2.5rem' }}
      >
        &lt;
      </button>
      {/* --- Dynamic width logic: all hooks at top level --- */}
      {(() => {
        // One ref and width per card
        const cardRefs = useRef(cards.map(() => React.createRef<HTMLDivElement>()));
        const [cardWidths, setCardWidths] = useState(cards.map(() => 520));
        useLayoutEffect(() => {
          // Only update the current card
          const idx = current;
          const ref = cardRefs.current[idx];
          if (ref && ref.current) {
            let width = 520;
            const el = ref.current;
            for (let i = 0; i < 5; i++) {
              if (el.scrollHeight > 600 && width < 1000) {
                width += 120;
                el.style.width = width + 'px';
              } else {
                break;
              }
            }
            setCardWidths(ws => ws.map((w, i) => (i === idx ? width : w)));
          }
        }, [current, cards.length]);
        return (
          <div className="overflow-visible flex justify-center items-center min-h-[420px]">
            {cards.map((card, idx) => (
              <div
                key={card.title}
                ref={cardRefs.current[idx]}
                className={`tool-card rounded-[18px] p-6 shadow-2xl flex flex-col mx-auto items-stretch border border-blue-200 bg-white transition-all duration-500 ease-in-out
                  ${current === idx ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-90 pointer-events-none absolute'}`}
                style={{
                  width: `${cardWidths[idx]}px`,
                  height: '600px',
                  minHeight: '420px',
                  maxWidth: '100vw',
                  position: current === idx ? 'relative' : 'absolute',
                  left: 0,
                  right: 0,
                  margin: '0 auto',
                  top: 0,
                  bottom: 0,
                  boxShadow: current === idx ? '0 8px 32px 0 rgba(0,0,0,0.12)' : 'none',
                  overflow: 'hidden',
                }}
              >
                <h3 className="tool-title text-blue-900 text-2xl font-extrabold mb-3 flex items-center gap-3 justify-center">
                  <span className="text-3xl">{card.icon}</span> {card.title}
                </h3>
                <p className="tool-description text-gray-700 mb-4 text-lg text-center">{card.desc}</p>
                <div>
                  {card.component}
                </div>
              </div>
            ))}
          </div>
        );
      })()}
      <button
  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 text-blue-700 border border-blue-700 rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-blue-800 hover:text-white transition"
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
            className={`w-3 h-3 rounded-full border ${current === idx ? 'bg-blue-700 border-blue-700' : 'bg-white border-blue-200'}`}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to tool ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
