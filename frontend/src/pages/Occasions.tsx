import {
  Search,
  Heart,
  Trash2,
  PenSquare,
  Gift,
  Calendar,
  Link,
  HandHeart,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Layout from "../components/Layout";
import CharityCard from "../components/CharityCard";
import Charity from "../interfaces/Charity";
import { occasionSchema } from "../schemas/occasionSchema";
import { useUser } from "@clerk/clerk-react";
import { useOccasions } from "../hooks/useOccasions";

export default function Occasions() {
  const { user } = useUser();
  const [selectedCharities, setSelectedCharities] = useState<Charity[]>([]);

  const {
    occasions,
    charities,
    favorites,
    isLoading,
    error,
    searchTerm,
    showForm,
    setShowForm,
    setSearchTerm,
    setIsEditing,
    setEditingId,
    handleCreateOrUpdateOccasion,
    deleteOccasionHandler,
  } = user?.id
    ? useOccasions(user.id, selectedCharities)
    : {
        occasions: [],
        charities: [],
        favorites: [],
        isLoading: false,
        searchTerm: "",
        error: "Could not identify user",
        showForm: false,
        setShowForm: () => {},
        setSearchTerm: () => {},
        setIsEditing: () => {},
        setEditingId: () => {},
        handleCreateOrUpdateOccasion: () => {},
        deleteOccasionHandler: () => {},
      };

  const form = useForm<z.infer<typeof occasionSchema>>({
    resolver: zodResolver(occasionSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "birthday",
      charities: [],
    },
  });

  return (
    <Layout>
      {!isLoading && occasions.length === 0 && !showForm ? (
        <motion.div
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
            y: -20,
          }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center"
        >
          <Gift size={64} className="mx-auto text-gray-400 mb-6" />
          <h3 className="text-xl font-medium text-gray-900 mb-4">
            No occasions yet
          </h3>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-all"
          >
            Create Occasion
          </button>
        </motion.div>
      ) : null}

      {showForm && (
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
        >
          <form onSubmit={form.handleSubmit(handleCreateOrUpdateOccasion)}>
            <div className="space-y-8">
              <div>
                <input
                  {...form.register("name")}
                  placeholder="Occasion name"
                  className="w-full text-2xl font-bold border-none focus:ring-0 px-0 placeholder-gray-400"
                />
              </div>

              <div className="space-y-4">
                <textarea
                  {...form.register("description")}
                  placeholder="Description"
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:ring-1 focus:ring-black"
                />

                <select
                  {...form.register("type")}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:ring-1 focus:ring-black"
                >
                  <option value="birthday">Birthday</option>
                  <option value="graduation">Graduation</option>
                  <option value="christmas">Christmas</option>
                  <option value="hanukkah">Hanukkah</option>
                  <option value="eid">Eid</option>
                  <option value="diwali">Diwali</option>
                  <option value="mother's day">Mother's Day</option>
                  <option value="father's day">Father's Day</option>
                  <option value="other">Other</option>
                </select>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Calendar
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="datetime-local"
                      {...form.register("start", {})}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div className="relative">
                    <Calendar
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="datetime-local"
                      {...form.register("end", {})}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-yellow-600">
                  <AlertTriangle size={16} />
                  <p className="text-sm">
                    You will not be able to edit the occasion after it has
                    started.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search charities..."
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:ring-1 focus:ring-black"
                  />
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
                {!error && (
                  <motion.div layout className="space-y-4">
                    <div className="grid gap-3">
                      {charities.map((charity) => (
                        <CharityCard
                          key={charity.every_id}
                          charity={charity}
                          onSelect={() => {
                            setSelectedCharities((prev) => {
                              if (
                                prev.find(
                                  (c) => c.every_id === charity.every_id
                                )
                              ) {
                                return prev.filter(
                                  (c) => c.every_id !== charity.every_id
                                );
                              } else {
                                return [...prev, charity];
                              }
                            });
                          }}
                          isSelected={selectedCharities.some(
                            (c) => c.every_id === charity.every_id
                          )}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                <motion.div layout className="space-y-4">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    <Heart size={16} className="text-red-500" />
                    Favorite Charities
                  </h3>
                  <div className="grid gap-3">
                    {favorites.map((charity) => (
                      <CharityCard
                        key={charity.every_id}
                        charity={charity}
                        onSelect={() => {
                          setSelectedCharities((prev) => {
                            if (
                              prev.find((c) => c.every_id === charity.every_id)
                            ) {
                              return prev.filter(
                                (c) => c.every_id !== charity.every_id
                              );
                            } else {
                              return [...prev, charity];
                            }
                          });
                        }}
                        isSelected={selectedCharities.some(
                          (c) => c.every_id === charity.every_id
                        )}
                      />
                    ))}
                  </div>
                </motion.div>

                {/* Selected Charities Section */}
                <motion.div layout className="space-y-4">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2 mt-8">
                    <HandHeart size={16} className="text-purple-500" />
                    Selected Charities
                  </h3>
                  {selectedCharities.length > 0 ? (
                    <div className="grid gap-3">
                      {selectedCharities.map((charity) => (
                        <CharityCard
                          key={charity.every_id}
                          charity={charity}
                          onSelect={() => {
                            setSelectedCharities((prev) =>
                              prev.filter(
                                (c) => c.every_id !== charity.every_id
                              )
                            );
                          }}
                          isSelected={true} // Always selected since it's in the selectedCharities list
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No charities selected yet.</p>
                  )}
                </motion.div>
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setIsEditing(false);
                    setEditingId(null);
                    setSearchTerm("");
                  }}
                  className="px-6 py-2 text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800"
                >
                  Save Occasion
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      )}

      {!isLoading && occasions.length > 0 && !showForm && (
        <motion.div layout className="grid gap-6">
          <h1 className="text-2xl font-semibold px-3 py-4">Occasions</h1>
          {occasions.map((occasion) => (
            <motion.div
              key={occasion._id}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              className="bg-white rounded-xl p-6 border border-gray-200"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {occasion.name}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {occasion.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{format(occasion.start, "MMM d, yyyy, h:mm a")}</span>
                    <span>→</span>
                    <span>{format(occasion.end, "MMM d, yyyy, h:mm a")}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                    }}
                    whileTap={{
                      scale: 0.95,
                    }}
                    className="p-2 text-gray-600 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
                  >
                    <a href={"occasions/" + occasion.url} target="_blank">
                      <Link size={20} />
                    </a>
                  </motion.button>
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                    }}
                    whileTap={{
                      scale: 0.95,
                    }}
                    onClick={() => {
                      setIsEditing(true);
                      setEditingId(occasion._id || null);
                      setShowForm(true);
                      form.setValue("name", occasion.name);
                      form.setValue("description", occasion.description);
                      form.setValue("type", occasion.type);
                      form.setValue(
                        "start",
                        format(new Date(occasion.start), "yyyy-MM-dd'T'HH:mm")
                      );
                      form.setValue(
                        "end",
                        format(new Date(occasion.end), "yyyy-MM-dd'T'HH:mm")
                      );
                      setSelectedCharities(occasion.charities);
                    }}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-colors"
                  >
                    <PenSquare size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                    }}
                    whileTap={{
                      scale: 0.95,
                    }}
                    onClick={() => deleteOccasionHandler(occasion._id || '')}
                    className="p-2 text-red-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 size={20} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
          <button
            onClick={() => {
              setShowForm(true);
              setIsEditing(false);
              setEditingId(null);
              setSearchTerm("");
              setSelectedCharities([]);
              form.reset();
            }}
            className="inline-flex items-center px-6 py-3 bg-black w-fit m-auto text-white rounded-full hover:bg-gray-800 transition-all"
          >
            Create another occasion
          </button>
        </motion.div>
      )}
    </Layout>
  );
}
