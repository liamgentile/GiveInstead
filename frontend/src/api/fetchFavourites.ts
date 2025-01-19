const FETCH_FAVOURITE_CHARITIES_API_URL = import.meta.env
  .VITE_FETCH_FAVOURITE_CHARITIES_API_URL;

export const fetchFavourites = async (userId: string) => {
  const response = await fetch(
    `${FETCH_FAVOURITE_CHARITIES_API_URL}/${userId}`
  );

  if (response.status === 304) {
    console.log("304 condition hit");
    return []; 
  }

  if (!response.ok) {
    throw new Error("Failed to fetch favourites");
  }

  return response.json();
};
