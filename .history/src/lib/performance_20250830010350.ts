/**
 * Lightweight non-UI performance helpers (JS-only). The UI/debug component
 * is provided in `performance.tsx` for dev-only overlays. Keeping a JS-only
 * module here prevents the TS compiler from attempting to parse JSX twice.
 */

export interface PerformanceMetrics {
  apiLatency: number;
  renderTime: number;
  pollsLoaded: number;
  cacheHits: number;
  timestamp: number;
}

export const trackApiCall = (endpoint: string, startTime: number) => {
  const duration = typeof performance !== 'undefined' ? performance.now() - startTime : Date.now() - startTime;
  // lightweight logging only
  if (typeof console !== 'undefined') console.log(`API ${endpoint}: ${duration.toFixed(1)}ms`);
  return duration;
};

export const trackRender = (componentName: string, startTime: number) => {
  const duration = typeof performance !== 'undefined' ? performance.now() - startTime : Date.now() - startTime;
  if (typeof console !== 'undefined') console.log(`Render ${componentName}: ${duration.toFixed(1)}ms`);
  return duration;
};

export const usePerformanceMonitor = () => {
  // stub for server modules or non-UI consumers; UI hook lives in performance.tsx
  return null as unknown as PerformanceMetrics | null;
};

