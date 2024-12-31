import Charity from "../interfaces/Charity";

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

  const response = await fetch("http://localhost:3000/favourite-charity", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(createDto),
  });

  if (!response.ok) {
    throw new Error("Failed to favorite charity");
  }

  return await response.json();
};

export const removeFavorite = async (charityId: string): Promise<void> => {
  const response = await fetch(
    `http://localhost:3000/favourite-charity/${charityId}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to unfavorite charity");
  }
};

export const updateNote = async (_id: string, note: string): Promise<void> => {
  const response = await fetch(`http://localhost:3000/favourite-charity/note`, {
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
