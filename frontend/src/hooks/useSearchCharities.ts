import { useState, useEffect } from "react";
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

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchTerm) {
        const searchCharities = async () => {
          setIsLoading(true);
          setError(null);
          try {
            const fetchedCharities = await fetchCharities(searchTerm);
            setCharities(fetchedCharities);
          } catch (err) {
            setError("Failed to fetch charities. Please try again.");
          } finally {
            setIsLoading(false);
          }
        };

        searchCharities();
      } else {
        setCharities([]);
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchTerm]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isModalOpen]);

  const toggleFavorite = async (charity: Charity) => {
    const isFavorited = favorites.some(
      (fav) => fav.every_id === charity.every_id
    );
    try {
      if (isFavorited) {
        const charityToDelete = favorites.find(
          (fav) => fav.every_id === charity.every_id
        );
        if (charityToDelete) {
          await removeFavorite(charityToDelete._id || "");
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
  };

  return {
    isLoading,
    charities,
    selectedCharity,
    isModalOpen,
    error,
    favorites,
    setSelectedCharity,
    setIsModalOpen,
    toggleFavorite,
  };
};
