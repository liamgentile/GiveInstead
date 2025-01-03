import { useState, useEffect } from "react";
import { fetchOccasionByUrl } from "../api/occasions";
import Occasion from "../interfaces/Occasion";

export const usePublicOccasion = (url: string) => {
  const [occasion, setOccasion] = useState<Occasion | null>(null);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [expandedCharity, setExpandedCharity] = useState<string | null>(null);
  const [totalProgress, setTotalProgress] = useState<Number>(0);
  const [hostName, setHostName] = useState<string | null>(null);
  const [copied, setCopied] = useState<Boolean>(false);

  useEffect(() => {
    if (occasion) {
      const total = occasion.charities.reduce((acc, charity) => {
        return (
          acc +
          (charity.donations?.reduce(
            (sum, donation) => sum + (donation.amount || 0),
            0
          ) || 0)
        );
      }, 0);
      setTotalProgress(total);
    }
  }, [occasion?.charities]);

  useEffect(() => {
    const loadOccasion = async () => {
      if (!url) return;

      setIsLoading(true);
      try {
        const { occasion, hostName } = await fetchOccasionByUrl(url);
        setOccasion(occasion);
        setHostName(hostName);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOccasion();
  }, [url]);

  const handleShareClick = () => {
    if (url) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return {
    occasion,
    isLoading,
    expandedCharity,
    setExpandedCharity,
    totalProgress,
    hostName,
    copied,
    handleShareClick,
    setIsLoading,
  };
};