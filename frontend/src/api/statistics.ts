import type Stats from "../interfaces/Stats";

const LIFETIME_RAISED_URL = import.meta.env.VITE_LIFETIME_RAISED_URL;
const TOP_CHARITY_URL = import.meta.env.VITE_TOP_CHARITY_URL;
const TOP_OCCASION_URL = import.meta.env.VITE_TOP_OCCASION_URL;

type CacheValue = { data: unknown; timestamp: number };
const cache: Map<string, CacheValue> = new Map();

async function handleJsonResponse<T>(response: Response): Promise<T | null> {
  const text = await response.text();
  if (!text || text.trim() === "") {
    return null;
  }
  try {
    const data = JSON.parse(text);
    return data as T;
  } catch (error) {
    console.error("JSON parsing error:", error);
    console.error("Response text:", text);
    return null;
  }
}

export const fetchLifetimeRaised = async (
  userId: string
): Promise<Stats["lifetimeRaised"]> => {
  const cacheKey = `stats:lifetimeRaised:${userId}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < 1000 * 60 * 2) {
    return (cached.data as number) || 0;
  }
  try {
    const response = await fetch(`${LIFETIME_RAISED_URL}/${userId}`);
    if (!response.ok) {
      if (response.status === 404) {
        return 0;
      }
      throw new Error(
        `Failed to fetch lifetime raised stats: ${response.statusText}`
      );
    }
    const data = await handleJsonResponse<Stats["lifetimeRaised"]>(response);
    const value = data || 0;
    cache.set(cacheKey, { data: value, timestamp: Date.now() });
    return value;
  } catch (error) {
    console.error("Error in fetchLifetimeRaised:", error);
    return 0;
  }
};

export const fetchTopCharity = async (
  userId: string
): Promise<Stats["topCharity"]> => {
  const cacheKey = `stats:topCharity:${userId}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < 1000 * 60 * 2) {
    return (cached.data as Stats["topCharity"]) || { charityName: "", amount: 0 };
  }
  try {
    const response = await fetch(`${TOP_CHARITY_URL}/${userId}`);
    if (!response.ok) {
      if (response.status === 404) {
        return { charityName: "", amount: 0 };
      }
      throw new Error(
        `Failed to fetch top charity stats: ${response.statusText}`
      );
    }
    const data = await handleJsonResponse<Stats["topCharity"]>(response);
    const value = data || { charityName: "", amount: 0 };
    cache.set(cacheKey, { data: value, timestamp: Date.now() });
    return value;
  } catch (error) {
    console.error("Error in fetchTopCharity:", error);
    return { charityName: "", amount: 0 };
  }
};

export const fetchTopOccasion = async (
  userId: string
): Promise<Stats["topOccasion"]> => {
  const cacheKey = `stats:topOccasion:${userId}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < 1000 * 60 * 2) {
    return (cached.data as Stats["topOccasion"]) || {
      occasionName: "",
      totalAmount: 0,
      startDate: new Date(),
      endDate: new Date(),
    };
  }
  try {
    const response = await fetch(`${TOP_OCCASION_URL}/${userId}`);
    if (!response.ok) {
      if (response.status === 404) {
        return {
          occasionName: "",
          totalAmount: 0,
          startDate: new Date(),
          endDate: new Date(),
        };
      }
      throw new Error(
        `Failed to fetch top occasion stats: ${response.statusText}`
      );
    }
    const data = await handleJsonResponse<Stats["topOccasion"]>(response);
    const value =
      data || {
        occasionName: "",
        totalAmount: 0,
        startDate: new Date(),
        endDate: new Date(),
      };
    cache.set(cacheKey, { data: value, timestamp: Date.now() });
    return value;
  } catch (error) {
    console.error("Error in fetchTopOccasion:", error);
    return {
      occasionName: "",
      totalAmount: 0,
      startDate: new Date(),
      endDate: new Date(),
    };
  }
};

export const fetchAllStats = async (userId: string): Promise<Stats> => {
  try {
    const [lifetimeRaised, topCharity, topOccasion] = await Promise.all([
      fetchLifetimeRaised(userId),
      fetchTopCharity(userId),
      fetchTopOccasion(userId),
    ]);

    return {
      lifetimeRaised,
      topCharity,
      topOccasion: {
        ...topOccasion,
        startDate: new Date(topOccasion.startDate),
        endDate: new Date(topOccasion.endDate),
      },
    };
  } catch (error) {
    console.error("Error in fetchAllStats:", error);
    return {
      lifetimeRaised: 0,
      topCharity: {
        charityName: "",
        amount: 0,
      },
      topOccasion: {
        occasionName: "",
        totalAmount: 0,
        startDate: new Date(),
        endDate: new Date(),
      },
    };
  }
};

export const __invalidateStatsCache = (userId: string) => {
  cache.delete(`stats:lifetimeRaised:${userId}`);
  cache.delete(`stats:topCharity:${userId}`);
  cache.delete(`stats:topOccasion:${userId}`);
};
