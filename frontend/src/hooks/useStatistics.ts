import { useEffect, useState } from "react";
import { fetchAllStats } from "../api/statistics";
import Stats from "../interfaces/Stats";

export const useStatistics = (userId: string) => {
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats>({
    lifetimeRaised: 0,
    topCharity: {
      name: "",
      amount: 0,
      description: "",
    },
    topOccasion: {
      name: "",
      amount: 0,
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true);

      try {
        const fetchedStats = await fetchAllStats(userId);
        if (fetchedStats) {
            setStats(fetchedStats);
          } else {
            setError("Failed to fetch statistics");
          }
      } catch (error) {
        setError("Error fetching statistics");
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, [userId]);

  return { stats, isLoading, error };
};
