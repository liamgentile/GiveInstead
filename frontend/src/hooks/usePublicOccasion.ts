import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { fetchOccasionByUrl } from "../api/occasions";
import Occasion from "../interfaces/Occasion";

export const usePublicOccasion = (url: string) => {
  const [occasion, setOccasion] = useState<Occasion | null>(null);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [expandedCharity, setExpandedCharity] = useState<string | null>(null);
  const [totalProgress, setTotalProgress] = useState<Number>(0);
  const [hostName, setHostName] = useState<string | null>(null);
  const [copied, setCopied] = useState<Boolean>(false);
  const lastDonationDateRef = useRef<Date | null>(null);

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

  const now = new Date();
  const hasStarted = occasion && now >= new Date(occasion.start);
  const hasEnded = occasion && now > new Date(occasion.end);

  const showDonationToast = (
    donorName: string,
    amount: number,
    charityName: string
  ) => {
    toast.info(
      `${donorName} donated $${amount.toLocaleString()} to ${charityName}! 🎉`,
      { position: "bottom-right", autoClose: 5000 }
    );
  };

  const toggleAccordion = (charityId: string) => {
    setExpandedCharity((prev) => (prev === charityId ? null : charityId));
  };

  useEffect(() => {
    if (occasion && occasion.charities) {
      const allDonations = occasion.charities.flatMap(
        (charity) =>
          charity.donations?.map((donation) => ({
            ...donation,
            charityName: charity.name,
          })) || []
      );

      const mostRecentDonation = allDonations
        .filter((donation) => donation.created_at)
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0];

      if (mostRecentDonation) {
        const { donor_name, amount, charityName, created_at } =
          mostRecentDonation;

        if (created_at !== lastDonationDateRef.current) {
          showDonationToast(donor_name, amount, charityName);
          lastDonationDateRef.current = created_at;
        }
      }
    }
  }, [occasion]);

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
    hasStarted,
    hasEnded,
    toggleAccordion,
  };
};
