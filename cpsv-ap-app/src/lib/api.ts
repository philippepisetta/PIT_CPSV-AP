// src/lib/api.ts

// Client-side in-memory cache to make page transitions and tab switching 100% instantaneous
const clientFetchCache = new Map<string, { promise: Promise<any>; timestamp: number }>();

const DEFAULT_TTL_MS = 15000; // 15 seconds client-side cache TTL

/**
 * Fetch helper with client-side promise caching.
 * Prevents duplicate network requests during rapid tab switches.
 */
export async function fetchWithCache<T = any>(url: string, ttl = DEFAULT_TTL_MS): Promise<T> {
  const now = Date.now();
  const cached = clientFetchCache.get(url);
  
  if (cached && (now - cached.timestamp < ttl)) {
    return cached.promise;
  }
  
  const promise = fetch(url).then(async (res) => {
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(`Erreur API (${res.status}): ${errText || res.statusText}`);
    }
    return res.json();
  }).catch((err) => {
    clientFetchCache.delete(url); // Remove failed request from cache
    throw err;
  });
  
  clientFetchCache.set(url, { promise, timestamp: now });
  return promise;
}

/**
 * Invalidates the client cache. Call this after any POST, PATCH, PUT, or DELETE request.
 */
export function invalidateClientCache(url?: string) {
  if (url) {
    clientFetchCache.delete(url);
    console.log(`[API Cache] Invalidation du cache pour l'URL: ${url}`);
  } else {
    clientFetchCache.clear();
    console.log("[API Cache] Invalidation globale du cache client");
  }
}
