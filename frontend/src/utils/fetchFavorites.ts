export const fetchFavorites = async (userId: string | undefined) => {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const favouriteCharityAPIURL = import.meta.env.VITE_FAVOURITE_CHARITY_API_URL;
  
    const response = await fetch(`${favouriteCharityAPIURL}${userId}`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch favorites");
    }
  
    return response.json();
  };