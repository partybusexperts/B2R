/**
 * Ultra-fast virtualized poll grid component
 * Only renders visible polls to reduce DOM size and improve performance
 */
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Poll } from '@/lib/pollsStore';

interface VirtualizedPollGridProps {
  polls: Poll[];
  onVote: (pollId: string, optionId: string) => void;
  className?: string;
  itemHeight?: number;
  containerHeight?: number;
}

const ITEM_HEIGHT = 300; // Approximate height of each poll card
const BUFFER_SIZE = 3; // Render 3 extra items above/below viewport

export default function VirtualizedPollGrid({
  polls,
  onVote,
  className = '',
  itemHeight = ITEM_HEIGHT,
  containerHeight = 600
}: VirtualizedPollGridProps) {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

  // Calculate which items should be visible
  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - BUFFER_SIZE);
    const endIndex = Math.min(
      polls.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + BUFFER_SIZE
    );
    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, polls.length]);

  const visiblePolls = useMemo(() => {
    return polls.slice(visibleRange.startIndex, visibleRange.endIndex + 1);
  }, [polls, visibleRange]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  // Total height for scrollbar
  const totalHeight = polls.length * itemHeight;

  // Offset for visible items
  const offsetY = visibleRange.startIndex * itemHeight;

  return (
    <div
      ref={setContainerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      {/* Virtual container with total height */}
      <div style={{ height: totalHeight, position: 'relative' }}>
        {/* Rendered items with offset */}
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {visiblePolls.map((poll, index) => {
            const actualIndex = visibleRange.startIndex + index;
            return (
              <PollCard
                key={poll.id}
                poll={poll}
                onVote={onVote}
                style={{ height: itemHeight }}
                data-index={actualIndex}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Optimized poll card component
interface PollCardProps {
  poll: Poll;
  onVote: (pollId: string, optionId: string) => void;
  style?: React.CSSProperties;
  'data-index'?: number;
}

function PollCard({ poll, onVote, style, 'data-index': dataIndex }: PollCardProps) {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = useCallback(async (optionId: string) => {
    if (isVoting) return;
    
    setIsVoting(true);
    setSelectedOption(optionId);
    
    try {
      await onVote(poll.id, optionId);
    } catch (error) {
      console.error('Vote failed:', error);
    } finally {
      setIsVoting(false);
    }
  }, [poll.id, onVote, isVoting]);

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 p-4 mb-4 shadow-sm hover:shadow-md transition-shadow"
      style={style}
      data-index={dataIndex}
    >
      <h3 className="font-semibold text-lg mb-3 text-gray-800">{poll.question}</h3>
      
      <div className="space-y-2">
        {poll.options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleVote(option.id)}
            disabled={isVoting}
            className={`w-full text-left px-4 py-2 rounded-md transition-all duration-200 ${
              selectedOption === option.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
            } ${isVoting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {option.text}
          </button>
        ))}
      </div>
      
      {poll.tags && poll.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {poll.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
