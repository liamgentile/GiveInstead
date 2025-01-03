import Charity from "../interfaces/Charity";
import EveryDotOrgCharity from "../interfaces/EveryDotOrgCharity";

const EVERY_DOT_ORG_SEARCH_URL = import.meta.env.VITE_EVERY_DOT_ORG_SEARCH_URL

export const fetchCharities = async (searchTerm: string): Promise<Charity[]> => {
    if (!searchTerm) {
      return [];
    }
  
    const everydotorgAPIKey = import.meta.env.VITE_EVERY_CHARITY_KEY;
    const response = await fetch(
      `${EVERY_DOT_ORG_SEARCH_URL}/${searchTerm}?apiKey=${everydotorgAPIKey}`
    );
  
    if (!response.ok) {
      throw new Error("Failed to fetch charities");
    }
  
    const data = await response.json();
  
    return data.nonprofits.map((charity: EveryDotOrgCharity) => ({
      _id: "",
      every_id: charity.ein,
      every_slug: charity.slug,
      name: charity.name,
      description: charity.description,
      image_url: charity.coverImageUrl,
      website: charity.websiteUrl,
    }));
  };