import {
  Heart,
  Trash2,
  PenSquare,
  AlertCircle,
  HeartHandshake,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../components/Layout";
import { useUser } from "@clerk/clerk-react";
import { useFavouriteCharities } from "../hooks/useFavouriteCharities";

export default function FavoriteCharities() {
  const { user } = useUser();

  const {
    favorites,
    isLoading,
    error,
    editingNoteId,
    setEditingNoteId,
    handleUpdateNote,
    removeFromFavourites,
  } = user?.id
    ? useFavouriteCharities(user.id)
    : {
        favorites: [],
        isLoading: false,
        error: "Could not identify user",
        editingNoteId: null,
        handleUpdateNote: () => {},
        removeFromFavourites: () => {},
        setEditingNoteId: () => {}
      };

  return (
    <Layout>
      <h1 className="text-2xl font-semibold px-3 py-4 mb-6">
        Your Favorite Charities
      </h1>

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
                {charity.image_url ? (
                  <img
                    src={charity.image_url}
                    alt={charity.name}
                    className="w-full sm:w-48 h-48 object-cover rounded-lg mb-4 sm:mb-0"
                  />
                ) : (
                  <HeartHandshake
                    size={48}
                    className="w-full sm:w-48 h-48 object-cover rounded-lg mb-4 sm:mb-0"
                  />
                )}

                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
                    {charity.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{charity.description}</p>

                  {editingNoteId === charity._id ? (
                    <div className="mb-4">
                      <textarea
                        className="w-full p-3 border rounded-md"
                        placeholder="Add a note..."
                        defaultValue={charity.note}
                        rows={3}
                        onBlur={(e) =>
                          handleUpdateNote(charity._id, e.target.value)
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
                      onClick={() => setEditingNoteId(charity._id)}
                      className="inline-flex items-center justify-center px-4 py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-50"
                    >
                      <PenSquare size={16} className="mr-2" />
                      {charity.note ? "Edit Note" : "Add Note"}
                    </button>

                    <button
                      onClick={() => removeFromFavourites(charity._id)}
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
    </Layout>
  );
}
