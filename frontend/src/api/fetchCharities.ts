import Charity from "../interfaces/Charity";
import EveryDotOrgCharity from "../interfaces/EveryDotOrgCharity";

const EVERY_DOT_ORG_SEARCH_URL = import.meta.env.VITE_EVERY_DOT_ORG_SEARCH_URL;

export const fetchCharities = async (
  searchTerm: string,
  options?: { signal?: AbortSignal }
): Promise<Charity[]> => {
  if (!searchTerm) {
    return [];
  }

  const everydotorgAPIKey = import.meta.env.VITE_EVERY_CHARITY_KEY;
  const cacheKey = `charities:${searchTerm}`;
  const cachedEntry = cache.get(cacheKey);
  if (cachedEntry && Date.now() - cachedEntry.timestamp < 1000 * 60 * 5) {
    return cachedEntry.data as Charity[];
  }

  const response = await fetch(
    `${EVERY_DOT_ORG_SEARCH_URL}/${encodeURIComponent(searchTerm)}?apiKey=${everydotorgAPIKey}`,
    { signal: options?.signal }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch charities");
  }

  const data = await response.json();

  const mapped: Charity[] = data.nonprofits.map((charity: EveryDotOrgCharity) => ({
    _id: "",
    every_id: charity.ein,
    every_slug: charity.slug,
    name: charity.name,
    description: charity.description,
    image_url: charity.coverImageUrl,
    website: charity.websiteUrl,
  }));
  cache.set(cacheKey, { data: mapped, timestamp: Date.now() });
  return mapped;
};

type CacheValue = { data: unknown; timestamp: number };
const cache: Map<string, CacheValue> = new Map();

export const __clearCharitiesCache = () => cache.clear();
