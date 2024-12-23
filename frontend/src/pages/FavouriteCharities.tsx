
import {
    Heart,
    Trash2,
    PenSquare,
    AlertCircle,
  } from "lucide-react";
  import { useState } from "react";
  import Layout from "../components/Layout";
  import { motion, AnimatePresence } from "framer-motion";
  interface Charity {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    category: string;
    website: string;
    isFavourite?: boolean;
  }
  interface Note {
    charityId: string;
    content: string;
  }
  interface CharityWithNote extends Charity {
    note?: string;
  }
  export default function FavoriteCharities() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [favourites, setfavourites] = useState<CharityWithNote[]>([]);
    const [selectedCharity, setSelectedCharity] =
      useState<CharityWithNote | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [notes, setNotes] = useState<Note[]>([]);
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
    const removeFromfavourites = (charityId: string) => {
      setfavourites((prev) => prev.filter((c) => c.id !== charityId));
      setNotes((prev) => prev.filter((n) => n.charityId !== charityId));
    };
    const updateNote = (charityId: string, content: string) => {
      setNotes((prev) => {
        const existingNoteIndex = prev.findIndex(
          (n) => n.charityId === charityId,
        );
        if (existingNoteIndex >= 0) {
          return prev.map((n) =>
            n.charityId === charityId
              ? {
                  ...n,
                  content,
                }
              : n,
          );
        }
        return [
          ...prev,
          {
            charityId,
            content,
          },
        ];
      });
      setEditingNoteId(null);
    };
    return (
      <Layout>
  
          <main className="flex-1 p-6 bg-gray-50">
            <div className="max-w-7xl mx-auto">
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
  
              {!isLoading && !error && favourites.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                  <Heart size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No favourites yet
                  </h3>
                  <p className="text-gray-500">
                    Start adding charities to your favourites to see them here
                  </p>
                </div>
              )}
  
              <div className="space-y-6">
                <AnimatePresence>
                  {favourites.map((charity) => (
                    <motion.div
                      key={charity.id}
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
                      className="bg-white rounded-lg shadow-sm p-6"
                    >
                      <div className="flex gap-6">
                        <img
                          src={charity.imageUrl}
                          alt={charity.name}
                          className="w-48 h-48 object-cover rounded-lg flex-shrink-0"
                          onClick={() => {
                            setSelectedCharity(charity);
                            setIsModalOpen(true);
                          }}
                        />
  
                        <div className="flex-1">
                          <h3 className="text-xl font-medium text-gray-900 mb-2">
                            {charity.name}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            {charity.description}
                          </p>
  
                          {editingNoteId === charity.id ? (
                            <div className="mb-4">
                              <textarea
                                className="w-full p-3 border rounded-md"
                                placeholder="Add a note..."
                                defaultValue={
                                  notes.find((n) => n.charityId === charity.id)
                                    ?.content
                                }
                                rows={3}
                                onBlur={(e) =>
                                  updateNote(charity.id, e.target.value)
                                }
                              />
                            </div>
                          ) : (
                            <div className="mb-4">
                              {notes.find((n) => n.charityId === charity.id)
                                ?.content && (
                                <p className="text-sm text-gray-500 italic">
                                  {
                                    notes.find((n) => n.charityId === charity.id)
                                      ?.content
                                  }
                                </p>
                              )}
                            </div>
                          )}
  
                          <div className="flex gap-3">
                            <button
                              onClick={() => setEditingNoteId(charity.id)}
                              className="inline-flex items-center px-4 py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-50"
                            >
                              <PenSquare size={16} className="mr-2" />
                              {notes.find((n) => n.charityId === charity.id)
                                ? "Edit Note"
                                : "Add Note"}
                            </button>
  
                            <button
                              onClick={() => removeFromfavourites(charity.id)}
                              className="inline-flex items-center px-4 py-2 text-sm text-red-600 border border-red-200 rounded-md hover:bg-red-50"
                            >
                              <Trash2 size={16} className="mr-2" />
                              Remove from favourites
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
  
  