import Occasion from "../interfaces/Occasion";
import OccasionWithHostName from "../interfaces/OccasionWithHostName";

const OCCASIONS_BASE_URL = import.meta.env.VITE_OCCASIONS_BASE_URL;
const CLERK_SERVICE_URL = import.meta.env.VITE_CLERK_SERVICE_URL;

type CacheValue = { data: unknown; timestamp: number };
const cache: Map<string, CacheValue> = new Map();

export const fetchOccasions = async (userId: string) => {
  const cacheKey = `occasions:${userId}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < 1000 * 60 * 2) {
    return cached.data as any[];
  }

  const response = await fetch(`${OCCASIONS_BASE_URL}/${encodeURIComponent(userId)}`);

  if (response.status === 304 || response.status === 404) {
    return [];
  } else if (!response.ok) {
    throw new Error("Failed to fetch occasions");
  } else {
    const data = await response.json();
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  }
};

export const createOrUpdateOccasion = async (
  occasionData: Occasion,
  editingId: string | null,
  userIdForCache?: string
): Promise<Occasion> => {
  const url = editingId
    ? `${OCCASIONS_BASE_URL}/${editingId}`
    : OCCASIONS_BASE_URL;
  const method = editingId ? "PATCH" : "POST";
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(occasionData),
  });

  if (!response.ok) {
    throw new Error(
      editingId ? "Failed to update occasion" : "Failed to create occasion"
    );
  }

  const result = await response.json();
  if (userIdForCache) {
    cache.delete(`occasions:${userIdForCache}`);
  }
  return result;
};

export const deleteOccasion = async (id: string): Promise<void> => {
  const response = await fetch(`${OCCASIONS_BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete occasion");
  }
  // cannot infer userId here, let callers invalidate if needed
};

export const fetchOccasionByUrl = async (
  url: string
): Promise<OccasionWithHostName> => {
  const response = await fetch(`${OCCASIONS_BASE_URL}/url/${encodeURIComponent(url)}`);

  if (!response.ok) {
    throw new Error("Failed to fetch occasion data");
  }
  const occasionData = await response.json();

  const clerk_user_id = occasionData.clerk_user_id;

  if (!clerk_user_id) {
    throw new Error("Failed to identify user");
  }

  const userResponse = await fetch(`${CLERK_SERVICE_URL}/${clerk_user_id}`);

  if (!userResponse.ok) {
    throw new Error("Failed to fetch user name");
  }

  const userData = await userResponse.text();

  return {
    occasion: occasionData,
    hostName: userData,
  };
};

export const __invalidateOccasionsCache = (userId: string) => {
  cache.delete(`occasions:${userId}`);
};
