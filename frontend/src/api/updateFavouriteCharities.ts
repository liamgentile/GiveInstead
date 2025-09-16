import Charity from "../interfaces/Charity";
import { __invalidateFavouritesCache } from "./fetchFavourites";

const FAVOURITE_CHARITY_BASE_URL = import.meta.env
  .VITE_FAVOURITE_CHARITY_BASE_URL;
const UPDATE_CHARITY_NOTE_URL = import.meta.env.VITE_UPDATE_CHARITY_NOTE_URL;

export const addFavorite = async (
  charity: Charity,
  userId: string
): Promise<Charity> => {
  const createDto = {
    every_id: charity.every_id,
    every_slug: charity.every_slug,
    clerk_user_id: userId,
    name: charity.name,
    website: charity.website,
    description: charity.description,
    image_url: charity.image_url,
  };

  const response = await fetch(FAVOURITE_CHARITY_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(createDto),
  });

  if (!response.ok) {
    throw new Error("Failed to favorite charity");
  }

  const created = await response.json();
  __invalidateFavouritesCache(userId);
  return created;
};

export const removeFavorite = async (charityId: string, userId?: string): Promise<void> => {
  const response = await fetch(`${FAVOURITE_CHARITY_BASE_URL}/${charityId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to unfavorite charity");
  }
  if (userId) {
    __invalidateFavouritesCache(userId);
  }
};

export const updateNote = async (_id: string, note: string): Promise<void> => {
  const response = await fetch(UPDATE_CHARITY_NOTE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ _id, note }),
  });

  if (!response.ok) {
    throw new Error("Failed to update note");
  }
};
