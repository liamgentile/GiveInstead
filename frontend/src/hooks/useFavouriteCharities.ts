import { useState, useEffect } from "react";
import Charity from "../interfaces/Charity";
import { fetchFavorites } from "../utils/fetchFavorites";
import { removeFavorite, updateNote } from "../utils/updateFavouriteCharities";

export const useFavouriteCharities = (userId: string) => {
  const [favorites, setFavorites] = useState<Charity[]>([]);
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    loadFavorites();
  }, [userId]);

  const handleUpdateNote = async (_id: string, note: string) => {
    try {
      await updateNote(_id, note);

      setFavorites((prevFavorites) =>
        prevFavorites.map((charity) =>
          charity._id === _id ? { ...charity, note } : charity
        )
      );
      setEditingNoteId(null);
    } catch (err) {
      setError("Failed to update the note");
    }
  };

  const removeFromFavourites = async (_id: string) => {
    try {
      await removeFavorite(_id);

      setFavorites((prevFavorites) =>
        prevFavorites.filter((charity) => charity._id !== _id)
      );
    } catch (err) {
      setError("Failed to remove from favorites");
    }
  };

  return {
    favorites,
    isLoading,
    error,
    editingNoteId,
    setFavorites,
    setError,
    handleUpdateNote,
    removeFromFavourites,
    setEditingNoteId,
  };
};
