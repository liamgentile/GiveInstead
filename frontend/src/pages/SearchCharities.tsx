import { Search, X, ExternalLink, Heart, HeartHandshake } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../components/Layout";
import { useUser } from "@clerk/clerk-react";
import { featuredCharities } from "../constants/featuredCharities";
import Charity from "../interfaces/Charity";
import { useSearchCharities } from "../hooks/useSearchCharities";

export default function SearchCharities() {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState<string>("");

  const {
    isLoading,
    charities,
    selectedCharity,
    isModalOpen,
    error,
    favorites,
    setSelectedCharity,
    setIsModalOpen,
    toggleFavorite,
  } = user?.id
    ? useSearchCharities(user?.id, searchTerm)
    : {
        isLoading: false,
        charities: [],
        selectedCharity: null,
        isModalOpen: false,
        error: "Could not identify user",
        favorites: [],
        setSelectedCharity: () => {},
        setIsModalOpen: () => {},
        toggleFavorite: () => {},
      };

  return (
    <Layout>
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

      {isLoading && searchTerm && (
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

      {error && <div className="text-center py-12 text-red-500">{error}</div>}

      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {charities.map((charity: Charity) => (
            <motion.div
              key={charity.every_id}
              layoutId={charity.every_id}
              onClick={() => {
                setSelectedCharity(charity);
                setIsModalOpen(true);
              }}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden relative"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(charity);
                }}
                className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors z-10"
              >
                <Heart
                  size={20}
                  className={`transition-colors ${
                    favorites.some(
                      (fav: Charity) => fav.every_id === charity.every_id
                    )
                      ? "fill-red-400 text-red-400"
                      : "text-gray-400"
                  }`}
                />
              </button>

              {charity.image_url ? (
                <img
                  src={charity.image_url}
                  alt={charity.name}
                  loading="lazy"
                  className="w-full h-48 object-cover rounded-lg"
                />
              ) : (
                <HeartHandshake
                  size={48}
                  className="w-full h-48 text-gray-400 mx-auto"
                />
              )}
              <div className="p-4">
                <h3 className="font-medium text-gray-900">{charity.name}</h3>
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
              key={charity.every_id}
              onClick={() => {
                setSelectedCharity(charity);
                setIsModalOpen(true);
              }}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden border-2 border-green-100 relative"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(charity);
                }}
                className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors z-10"
              >
                <Heart
                  size={20}
                  className={`transition-colors ${
                    favorites.some(
                      (fav: Charity) => fav.every_id === charity.every_id
                    )
                      ? "fill-red-400 text-red-400"
                      : "text-gray-400"
                  }`}
                />
              </button>

              {charity.image_url ? (
                <img
                  src={charity.image_url}
                  alt={charity.name}
                  loading="lazy"
                  className="w-full h-48 object-cover"
                />
              ) : (
                <HeartHandshake
                  size={48}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="font-medium text-gray-900">{charity.name}</h3>
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
              layoutId={selectedCharity.every_id}
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

                {selectedCharity.image_url ? (
                  <img
                    src={selectedCharity.image_url}
                    alt={selectedCharity.name}
                    loading="lazy"
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
                  {selectedCharity.website && (
                    <a
                      href={selectedCharity.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-green-800 text-white rounded-md hover:bg-green-900 transition-colors"
                    >
                      Visit Website
                      <ExternalLink size={16} className="ml-2" />
                    </a>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(selectedCharity);
                    }}
                    className="inline-flex items-center px-4 py-2 border-2 border-red-400 rounded-md hover:bg-red-50 transition-colors"
                  >
                    <Heart
                      size={16}
                      className={`mr-2 transition-colors ${
                        favorites.some(
                          (fav: Charity) =>
                            fav.every_id === selectedCharity.every_id
                        )
                          ? "fill-red-400 text-red-400"
                          : "text-red-400"
                      }`}
                    />
                    {favorites.some(
                      (fav: Charity) =>
                        fav.every_id === selectedCharity.every_id
                    )
                      ? "Remove from Favorites"
                      : "Add to Favorites"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
