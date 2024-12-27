import { Heart, Trash2, PenSquare, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../components/Layout";
import { useUser } from "@clerk/clerk-react";

interface Charity {
  _id: string;
  every_id: string;
  name: string;
  description: string;
  image_url: string;
  category: string;
  website: string;
  isFavorite?: boolean;
}

interface CharityWithNote extends Charity {
  note?: string;
}

export default function FavoriteCharities() {
  const { user } = useUser();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<CharityWithNote[]>([]);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true);

      if (!user?.id) return;

      try {
        const response = await fetch(
          `http://localhost:3000/favourite-charity/user/${user.id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch favorites");
        }
        const data = await response.json();
        setFavorites(data);
      } catch (err) {
        setError("Failed to load favorites");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [user?.id]);

  const handleUpdateNote = async (charityId: string, content: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/favourite-charity/note`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clerk_user_id: user?.id,
            every_id: charityId,
            note: content,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update note");
      }

      setFavorites((prevFavorites) =>
        prevFavorites.map((charity) =>
          charity.every_id === charityId
            ? { ...charity, note: content }
            : charity
        )
      );
      setEditingNoteId(null);
    } catch (err) {
      setError("Failed to update the note");
    }
  };

  // Function to remove charity from favorites
  const removeFromFavorites = async (_id: string) => {
    try {
      await fetch(`http://localhost:3000/favourite-charity/${_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      setFavorites((prevFavorites) =>
        prevFavorites.filter((charity) => charity._id !== _id)
      );

    } catch (err) {
      setError("Failed to remove from favourite");
    }
  };

  return (
    <Layout>
      <main className="flex-1 p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-l font-semibold px-3 py-4 mb-6">
            Your Favorite Charities
          </h1>

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
            <div className="flex items-center justify-center py-12 text-red-500 gap-2">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {!isLoading && !error && favorites.length === 0 && (
            <div className="text-center py-12 px-4 bg-white rounded-lg shadow-sm">
              <Heart size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No favorites yet
              </h3>
              <p className="text-gray-500">
                Start adding charities to your favorites to see them here
              </p>
            </div>
          )}

          <div className="space-y-4 sm:space-y-6">
            <AnimatePresence>
              {favorites.map((charity) => (
                <motion.div
                  key={charity.every_id}
                  layout
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: -100,
                  }}
                  className="bg-white rounded-lg shadow-sm p-4 sm:p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:gap-6">
                    <img
                      src={charity.image_url}
                      alt={charity.name}
                      className="w-full sm:w-48 h-48 object-cover rounded-lg mb-4 sm:mb-0"
                    />

                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
                        {charity.name}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {charity.description}
                      </p>

                      {editingNoteId === charity.every_id ? (
                        <div className="mb-4">
                          <textarea
                            className="w-full p-3 border rounded-md"
                            placeholder="Add a note..."
                            defaultValue={charity.note}
                            rows={3}
                            onBlur={(e) =>
                              handleUpdateNote(charity.every_id, e.target.value)
                            }
                          />
                        </div>
                      ) : (
                        <div className="mb-4">
                          {charity.note && (
                            <p className="text-sm text-gray-500 italic">
                              {charity.note}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => setEditingNoteId(charity.every_id)}
                          className="inline-flex items-center justify-center px-4 py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-50"
                        >
                          <PenSquare size={16} className="mr-2" />
                          {charity.note ? "Edit Note" : "Add Note"}
                        </button>

                        <button
                          onClick={() => removeFromFavorites(charity._id)}
                          className="inline-flex items-center justify-center px-4 py-2 text-sm text-red-600 border border-red-200 rounded-md hover:bg-red-50"
                        >
                          <Trash2 size={16} className="mr-2" />
                          Remove from Favorites
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </Layout>
  );
}
