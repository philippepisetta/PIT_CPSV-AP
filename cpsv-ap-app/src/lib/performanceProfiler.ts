// src/lib/performanceProfiler.ts

export const startMeasure = (name: string) => {
  if (typeof window === "undefined" || !window.performance) return;
  
  // Clear any existing mark with the same name
  try {
    performance.clearMarks(`start-${name}`);
    performance.clearMeasures(name);
  } catch (e) {}
  
  performance.mark(`start-${name}`);
};

export const endMeasure = (name: string) => {
  if (typeof window === "undefined" || !window.performance) return 0;
  
  try {
    performance.mark(`end-${name}`);
    performance.measure(name, `start-${name}`, `end-${name}`);
    
    const entries = performance.getEntriesByName(name);
    if (entries.length > 0) {
      const duration = entries[0].duration;
      console.log(`[PIT-PERF] ${name} took ${duration.toFixed(2)}ms`);
      return duration;
    }
  } catch (e) {
    console.error(`Failed to measure performance for: ${name}`, e);
  }
  return 0;
};
