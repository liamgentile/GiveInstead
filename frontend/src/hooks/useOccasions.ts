import { useState, useEffect } from "react";
import { fetchOccasions, createOrUpdateOccasion, deleteOccasion } from "../api/occasions";
import { fetchFavorites } from "../api/fetchFavorites";
import { fetchCharities } from "../api/fetchCharities";
import { v4 as uuidv4 } from 'uuid';
import Charity from "../interfaces/Charity";
import Occasion from "../interfaces/Occasion";

export const useOccasions = (
  userId: string,
  editingOccasion: Occasion | null,
  selectedCharities: Charity[]
) => {
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [charities, setCharities] = useState<Charity[]>([]);
  const [favorites, setFavorites] = useState<Charity[]>([]);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showForm, setShowForm] = useState<Boolean>(false);

  const loadOccasions = async () => {
    setIsLoading(true);
    try {
      const fetchedOccasions = await fetchOccasions(userId);
      setOccasions(fetchedOccasions);
    } catch (err) {
      setError("Failed to load occasions");
    } finally {
      setIsLoading(false);
    }
  };

  const loadFavorites = async () => {
    setIsLoading(true);
    try {
      const data = await fetchFavorites(userId);
      setFavorites(data);
    } catch (err) {
      setError("Failed to load favorites");
    } finally {
      setIsLoading(false);
    }
  };

  const searchCharitiesHandler = async () => {
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

  const handleCreateOrUpdateOccasion = async (data: any) => {
    setIsLoading(true);
    try {
      const occasionData = {
        clerk_user_id: userId,
        name: data.name,
        description: data.description,
        type: data.type,
        start: data.start,
        end: data.end,
        url: editingOccasion ? editingOccasion.url : uuidv4(),
        charities: selectedCharities.map((charity: any) => ({
          every_id: charity.ein || charity.every_id,
          every_slug: charity.slug || charity.every_slug,
          name: charity.name,
          website: charity.website,
          description: charity.description,
          image_url: charity.image_url,
        })),
      };

      const savedOccasion = await createOrUpdateOccasion(occasionData, editingOccasion);

      if (editingOccasion) {
        setOccasions((prevOccasions) =>
          prevOccasions.map((o) =>
            o._id === editingOccasion._id ? { ...o, ...savedOccasion } : o
          )
        );
      } else {
        setOccasions((prevOccasions) => [...prevOccasions, savedOccasion]);
      }

      setSearchTerm("");
      setShowForm(false);
    } catch (err) {
      setError(
        editingOccasion ? "Failed to update occasion" : "Failed to create occasion"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const deleteOccasionHandler = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteOccasion(id);
      setOccasions((prevOccasions) =>
        prevOccasions.filter((o) => o._id !== id)
      );
    } catch (err) {
      setError("Failed to delete occasion");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadOccasions();
      loadFavorites();
    }
  }, [userId]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchTerm) {
        searchCharitiesHandler();
      } else {
        setCharities([]);
      }
    }, 500);
  
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  return {
    occasions,
    charities,
    favorites,
    isLoading,
    error,
    searchTerm,
    showForm,
    setShowForm,
    setSearchTerm,
    handleCreateOrUpdateOccasion,
    deleteOccasionHandler,
  };
};
