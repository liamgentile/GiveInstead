import { useState, useEffect, useCallback, useMemo, useDeferredValue, useRef } from "react";
import { fetchFavourites } from "../api/fetchFavourites";
import { fetchCharities } from "../api/fetchCharities";
import { addFavorite, removeFavorite } from "../api/updateFavouriteCharities";
import Charity from "../interfaces/Charity";

export const useSearchCharities = (userId: string, searchTerm: string) => {
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [charities, setCharities] = useState<Charity[]>([]);
  const [selectedCharity, setSelectedCharity] = useState<Charity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<Boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Charity[]>([]);

  useEffect(() => {
    const loadFavorites = async () => {
      setIsLoading(true);
      try {
        const data = await fetchFavourites(userId);
        setFavorites(data);
      } catch (err) {
        setError(`Failed to load favourites ${(err as Error).message}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, [userId]);

  const deferredTerm = useDeferredValue(searchTerm);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!deferredTerm) {
      setCharities([]);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const run = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedCharities = await fetchCharities(deferredTerm, { signal: controller.signal });
        setCharities(fetchedCharities);
      } catch (err) {
        if ((err as any)?.name !== "AbortError") {
          setError("Failed to fetch charities. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    const t = setTimeout(run, 400);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [deferredTerm]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isModalOpen]);

  const toggleFavorite = useCallback(async (charity: Charity) => {
    const isFavorited = favorites.some(
      (fav) => fav.every_id === charity.every_id
    );
    try {
      if (isFavorited) {
        const charityToDelete = favorites.find(
          (fav) => fav.every_id === charity.every_id
        );
        if (charityToDelete) {
          await removeFavorite(charityToDelete._id || "", userId);
          setFavorites((prev) =>
            prev.filter((fav) => fav.every_id !== charity.every_id)
          );
        }
      } else {
        const createdCharity = await addFavorite(charity, userId);
        setFavorites((prev) => [...prev, createdCharity]);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  }, [favorites, userId]);

  return {
    isLoading,
    charities,
    selectedCharity,
    isModalOpen,
    error,
    favorites: useMemo(() => favorites, [favorites]),
    setSelectedCharity,
    setIsModalOpen,
    toggleFavorite,
  };
};
