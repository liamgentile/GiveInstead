import { useState, useEffect, useCallback, useMemo, useDeferredValue, useRef } from "react";
import {
  fetchOccasions,
  createOrUpdateOccasion,
  deleteOccasion,
} from "../api/occasions";
import { fetchFavourites } from "../api/fetchFavourites";
import { fetchCharities } from "../api/fetchCharities";
import { v4 as uuidv4 } from "uuid";
import Charity from "../interfaces/Charity";
import Occasion from "../interfaces/Occasion";

export const useOccasions = (userId: string, selectedCharities: Charity[]) => {
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [charities, setCharities] = useState<Charity[]>([]);
  const [favorites, setFavorites] = useState<Charity[]>([]);
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showForm, setShowForm] = useState<Boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedCharity, setExpandedCharity] = useState<string | null>(null);

  const [showArchived, setShowArchived] = useState<Boolean>(false);

  const currentDate = new Date();
  const activeOccasions = useMemo(
    () => occasions.filter((occasion) => new Date(occasion.end) > currentDate),
    [occasions]
  );
  const archivedOccasions = useMemo(
    () => occasions.filter((occasion) => new Date(occasion.end) <= currentDate),
    [occasions]
  );

  const displayedOccasions = useMemo(
    () => (showArchived ? archivedOccasions : activeOccasions),
    [showArchived, archivedOccasions, activeOccasions]
  );

  const loadOccasions = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedOccasions = await fetchOccasions(userId);
      setOccasions(fetchedOccasions);
    } catch (err) {
      setError("Failed to load occasions");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const loadFavorites = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchFavourites(userId);
      setFavorites(data);
    } catch (err) {
      setError("Failed to load favourites");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const deferredSearchTerm = useDeferredValue(searchTerm);
  const abortRef = useRef<AbortController | null>(null);

  const searchCharitiesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const fetchedCharities = await fetchCharities(deferredSearchTerm, { signal: controller.signal });
      setCharities(fetchedCharities);
    } catch (err) {
      if ((err as any)?.name !== "AbortError") {
        setError("Failed to fetch charities. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [deferredSearchTerm]);

  const handleCreateOrUpdateOccasion = useCallback(async (data: any): Promise<void> => {
    setIsLoading(true);
    try {
      const occasionData = {
        name: data.name,
        description: data.description,
        type: data.type,
        start: data.start,
        end: data.end,
        url: isEditing
          ? occasions.find((o) => o._id === editingId)?.url
          : uuidv4(),
        charities: selectedCharities.map((charity: any) => ({
          every_id: charity.ein || charity.every_id,
          every_slug: charity.primarySlug || charity.every_slug,
          name: charity.name,
          website: charity.website,
          description: charity.description,
          image_url: charity.image_url,
        })),
      };

      const savedOccasion = await createOrUpdateOccasion(
        occasionData,
        isEditing ? editingId : null,
        userId
      );

      if (isEditing) {
        setOccasions((prevOccasions) =>
          prevOccasions.map((o) =>
            o._id === editingId ? { ...o, ...savedOccasion } : o
          )
        );
      } else {
        setOccasions((prevOccasions) => [...prevOccasions, savedOccasion]);
      }

      setSearchTerm("");
      setShowForm(false);
      setIsEditing(false);
      setEditingId(null);
    } catch (err) {
      setError(
        isEditing ? "Failed to update occasion" : "Failed to create occasion"
      );
    } finally {
      setIsLoading(false);
    }
  }, [userId, isEditing, editingId, occasions, selectedCharities]);

  const deleteOccasionHandler = useCallback(async (id: string): Promise<void> => {
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
  }, []);

  const toggleAccordion = useCallback((charityId: string) => {
    setExpandedCharity((prev) => (prev === charityId ? null : charityId));
  }, []);

  useEffect(() => {
    if (userId) {
      loadOccasions();
      loadFavorites();
    }
  }, [userId]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (deferredSearchTerm) {
        searchCharitiesHandler();
      } else {
        setCharities([]);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [deferredSearchTerm, searchCharitiesHandler]);

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
    setIsEditing,
    setEditingId,
    handleCreateOrUpdateOccasion,
    deleteOccasionHandler,
    displayedOccasions,
    showArchived,
    archivedOccasions,
    setShowArchived,
    expandedCharity,
    toggleAccordion,
  };
};
