import Charity from "../interfaces/Charity";

export const fetchCharities = async (searchTerm: string): Promise<Charity[]> => {
    if (!searchTerm) {
      return [];
    }
  
    const everydotorgAPIKey = import.meta.env.VITE_EVERY_CHARITY_KEY;
    const response = await fetch(
      `https://partners.every.org/v0.2/search/${searchTerm}?apiKey=${everydotorgAPIKey}`
    );
  
    if (!response.ok) {
      throw new Error("Failed to fetch charities");
    }
  
    const data = await response.json();
  
    return data.nonprofits.map((charity: any) => ({
      _id: "",
      every_id: charity.ein,
      every_slug: charity.slug,
      name: charity.name,
      description: charity.description,
      imageUrl: charity.coverImageUrl,
      website: charity.websiteUrl,
    }));
  };