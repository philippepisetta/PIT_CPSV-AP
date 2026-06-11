// src/lib/graphLayoutCache.ts

interface Position {
  x: number;
  y: number;
}

// Global in-memory cache for node positions based on nodeId and graph mode
const positionCache: Record<string, Position> = {};

export const getCachedPosition = (
  nodeId: string,
  mode: string,
  calculator: () => Position
): Position => {
  const cacheKey = `${nodeId}-${mode}`;
  if (!positionCache[cacheKey]) {
    positionCache[cacheKey] = calculator();
  }
  return positionCache[cacheKey];
};

export const clearPositionCache = () => {
  for (const key in positionCache) {
    delete positionCache[key];
  }
};
