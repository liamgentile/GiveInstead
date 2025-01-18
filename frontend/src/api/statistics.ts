import type Stats from "../interfaces/Stats";

const LIFETIME_RAISED_URL = import.meta.env.VITE_LIFETIME_RAISED_URL;
const TOP_CHARITY_URL = import.meta.env.VITE_TOP_CHARITY_URL;
const TOP_OCCASION_URL = import.meta.env.VITE_TOP_OCCASION_URL;

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
    return data || 0;
  } catch (error) {
    console.error("Error in fetchLifetimeRaised:", error);
    return 0;
  }
};

export const fetchTopCharity = async (
  userId: string
): Promise<Stats["topCharity"]> => {
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
    return data || { charityName: "", amount: 0 };
  } catch (error) {
    console.error("Error in fetchTopCharity:", error);
    return { charityName: "", amount: 0 };
  }
};

export const fetchTopOccasion = async (
  userId: string
): Promise<Stats["topOccasion"]> => {
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
    return (
      data || {
        occasionName: "", 
        totalAmount: 0,
        startDate: new Date(),
        endDate: new Date(),
      }
    );
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
