/**
 * Performance monitor - tracks render times and API latency
 */
'use client';

import React, { useEffect, useState } from 'react';

interface PerformanceMetrics {
  apiLatency: number;
  renderTime: number;
  pollsLoaded: number;
  cacheHits: number;
  timestamp: number;
}

const performanceMetrics: PerformanceMetrics[] = [];

export function trackApiCall(endpoint: string, startTime: number) {
  const duration = performance.now() - startTime;
  console.log(`🚀 API ${endpoint}: ${duration.toFixed(1)}ms`);
  return duration;
}

export function trackRender(componentName: string, startTime: number) {
  const duration = performance.now() - startTime;
  console.log(`🎨 Render ${componentName}: ${duration.toFixed(1)}ms`);
  return duration;
}

export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  
  useEffect(() => {
    // Track Core Web Vitals
    if (typeof window !== 'undefined' && 'performance' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'measure' && entry.name.startsWith('poll-')) {
            console.log(`📊 ${entry.name}: ${entry.duration.toFixed(1)}ms`);
          }
        });
      });
      
      observer.observe({ entryTypes: ['measure', 'navigation'] });
      
      return () => observer.disconnect();
    }
  }, []);
  
  return metrics;
}

export function PerfDebugger() {
  const metrics = usePerformanceMonitor();
  
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded text-xs font-mono z-50">
      <div>🚀 Performance Monitor</div>
      {metrics && (
        <>
          <div>API: {metrics.apiLatency.toFixed(1)}ms</div>
          <div>Render: {metrics.renderTime.toFixed(1)}ms</div>
          <div>Polls: {metrics.pollsLoaded}</div>
        </>
      )}
    </div>
  );
}
