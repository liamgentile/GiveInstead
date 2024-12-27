import { Search, X, ExternalLink, Star, HeartHandshake } from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../components/Layout";
import { useUser } from "@clerk/clerk-react";

interface Charity {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  website: string;
  isFavorite?: boolean;
}

export default function SearchCharities() {
  const { user } = useUser();

  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [charities, setCharities] = useState<Charity[]>([]);
  const [selectedCharity, setSelectedCharity] = useState<Charity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user?.id) return;

      try {
        const response = await fetch(
          `http://localhost:3000/favourite-charity/user/${user.id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch favorite charities");
        }
        const data = await response.json();
        const favoriteIds = data.map((fav: any) => fav.every_id); 
        setFavorites(favoriteIds);
      } catch (err) {
        console.error(err);
        setError("Could not load favorite charities.");
      }
    };

    fetchFavorites();
  }, [user?.id]);

  useEffect(() => {
    const searchCharities = async () => {
      if (!searchTerm) {
        setCharities([]);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const everydotorgAPIKey = import.meta.env.VITE_EVERY_CHARITY_KEY;

        const response = await fetch(
          `https://partners.every.org/v0.2/search/${searchTerm}?apiKey=${everydotorgAPIKey}`
        );
        const data = await response.json();

        const fetchedCharities: Charity[] = data.nonprofits.map(
          (charity: any) => ({
            _id: charity.ein,
            name: charity.name,
            description: charity.description,
            imageUrl: charity.coverImageUrl,
            website: charity.websiteUrl,
          })
        );

        console.log(fetchedCharities);

        setCharities(fetchedCharities);
      } catch (err) {
        setError("Failed to fetch charities. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(searchCharities, 500);
    return () => clearTimeout(debounce);
  }, [searchTerm]);
  const featuredCharities: Charity[] = [
    {
      _id: "822281466",
      name: "Wild Animal Initiative",
      description:
        "We are dedicated to finding evidence-backed ways to improve the lives of animals in the wild.  We depend on individual donors to help us make life better for wild animals. To a small nonprofit working hard on a big problem, your support is more crucial now than ever!",
      imageUrl:
        "https://res.cloudinary.com/everydotorg/image/upload/f_auto,c_limit,w_1920,q_auto/profile_pics/ap5t5cjcylr7xktnldno",
      website: "https://wildanimalinitiative.org",
    },
    {
      _id: "873020380",
      name: "Aquatic Life Institute",
      description:
        "Aquatic Life Institute was formed to specifically advance animal welfare for the nearly 500 billion farmed fish and shrimp, and 2-3 trillion wild aquatic animals in the global food system.",
      imageUrl:
        "https://res.cloudinary.com/everydotorg/image/upload/f_auto,c_limit,w_1920,q_auto/profile_pics/kbfxjmzl39rlrs4nxnp3",
      website: "https://ali.fish",
    },
    {
      _id: "510292919",
      name: "Farm Sanctuary",
      description:
        "Farm Sanctuary fights the disastrous effects of animal agriculture on animals, the environment, social justice, and public health through rescue, education, and advocacy.",
      imageUrl:
        "https://assets.farmsanctuary.org/content/uploads/2024/12/06092318/2024_09_13_FSAC_Grace_and_Jodean_Pigs_DM_4638-scaled-e1733495282772-1600x911.jpg",
      website: "https://farmsanctuary.org/",
    },
  ];
  const toggleFavorite = async (e: React.MouseEvent, charity: Charity) => {
    e.stopPropagation();

    const isFavorited = favorites.includes(charity._id);

    if (isFavorited) {
      await fetch(`http://localhost:3000/favourite-charity/${charity._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setFavorites((prev) => prev.filter((_id) => _id !== charity._id));
    } else {

    console.log(charity);

    const createDto = {
      every_id: charity._id,
      clerk_user_id: user?.id,
      name: charity.name,
      website: charity.website,
      description: charity.description,
      image_url: charity.imageUrl,
    };

    await fetch("http://localhost:3000/favourite-charity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(createDto),
    });

    setFavorites((prev) => [...prev, charity._id]);
    }
  };

  return (
    <Layout>
      <main className="flex-1 p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for charities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none text-gray-600"
              />
            </div>
          </div>

          {isLoading && (
            <div className="text-center py-12">
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full mx-auto"
              />
            </div>
          )}

          {error && (
            <div className="text-center py-12 text-red-500">{error}</div>
          )}

          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {charities.map((charity) => (
                <motion.div
                  key={charity._id}
                  layoutId={charity._id}
                  onClick={() => {
                    setSelectedCharity(charity);
                    setIsModalOpen(true);
                  }}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden relative"
                >
                  <button
                    onClick={(e) => toggleFavorite(e, charity)}
                    className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors z-10"
                  >
                    <Star
                      size={20}
                      className={`transition-colors ${
                        favorites.includes(charity._id)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-400"
                      }`}
                    />
                  </button>

                  {charity.imageUrl ? (
                    <img
                      src={charity.imageUrl}
                      alt={charity.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ) : (
                    <HeartHandshake
                      size={48} // Adjust the size as needed
                      className="w-full h-48 text-gray-400 mx-auto"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900">
                      {charity.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {charity.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-16">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Featured Charities
            </h2>
            <div className="h-px bg-gray-200 mb-8" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCharities.map((charity) => (
                <motion.div
                  key={charity._id}
                  layoutId={charity._id}
                  onClick={() => {
                    setSelectedCharity(charity);
                    setIsModalOpen(true);
                  }}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden border-2 border-green-100 relative"
                >
                  <button
                    onClick={(e) => toggleFavorite(e, charity)}
                    className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors z-10"
                  >
                    <Star
                      size={20}
                      className={`transition-colors ${
                        favorites.includes(charity._id)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-400"
                      }`}
                    />
                  </button>

                  {charity.imageUrl ? (
                    <img
                      src={charity.imageUrl}
                      alt={charity.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <HeartHandshake
                      size={48}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900">
                      {charity.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {charity.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {isModalOpen && selectedCharity && (
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              >
                <motion.div
                  layoutId={selectedCharity._id}
                  className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-2xl font-semibold text-gray-900">
                        {selectedCharity.name}
                      </h2>
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    {selectedCharity.imageUrl ? (
                      <img
                        src={selectedCharity.imageUrl}
                        alt={selectedCharity.name}
                        className="w-full h-64 object-cover rounded-lg mb-4"
                      />
                    ) : (
                      <HeartHandshake
                        size={48}
                        className="w-full h-64 object-cover rounded-lg mb-4"
                      />
                    )}

                    <p className="text-gray-600 mb-4">
                      {selectedCharity.description}
                    </p>

                    <div className="flex gap-3">
                      <a
                        href={selectedCharity.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-green-800 text-white rounded-md hover:bg-green-900 transition-colors"
                      >
                        Visit Website
                        <ExternalLink size={16} className="ml-2" />
                      </a>

                      <button
                        onClick={(e) => toggleFavorite(e, selectedCharity)}
                        className="inline-flex items-center px-4 py-2 border-2 border-yellow-400 rounded-md hover:bg-yellow-50 transition-colors"
                      >
                        <Star
                          size={16}
                          className={`mr-2 transition-colors ${
                            favorites.includes(selectedCharity._id)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-yellow-400"
                          }`}
                        />
                        {favorites.includes(selectedCharity._id)
                          ? "Remove from Favorites"
                          : "Add to Favorites"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </Layout>
  );
}
