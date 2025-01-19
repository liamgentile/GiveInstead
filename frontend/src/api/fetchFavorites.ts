const FETCH_FAVOURITE_CHARITIES_API_URL = import.meta.env
  .VITE_FETCH_FAVOURITE_CHARITIES_API_URL;

export const fetchFavorites = async (userId: string) => {
  const response = await fetch(
    `${FETCH_FAVOURITE_CHARITIES_API_URL}/${userId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch favorites");
  }

  return response.json();
};
