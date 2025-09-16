const FETCH_FAVOURITE_CHARITIES_API_URL = import.meta.env
  .VITE_FETCH_FAVOURITE_CHARITIES_API_URL;

type CacheValue = { data: unknown; timestamp: number };
const cache: Map<string, CacheValue> = new Map();

export const fetchFavourites = async (userId: string) => {
  const cacheKey = `favourites:${userId}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < 1000 * 60 * 2) {
    return cached.data as any[];
  }

  const response = await fetch(
    `${FETCH_FAVOURITE_CHARITIES_API_URL}/${encodeURIComponent(userId)}`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (response.status === 304) {
    return [];
  } else if (!response.ok) {
    throw new Error("Failed to fetch favourites");
  } else {
    const data = await response.json();
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  }
};

export const __invalidateFavouritesCache = (userId: string) => {
  cache.delete(`favourites:${userId}`);
};
