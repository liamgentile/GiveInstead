import {
  Search,
  Heart,
  Trash2,
  PenSquare,
  Gift,
  Link,
  HandHeart,
  AlertTriangle,
  ChevronDown,
  Calendar,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
    showArchived,
    setShowArchived,
    displayedOccasions,
    archivedOccasions,
    expandedCharity,
    toggleAccordion,
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
        showArchived: false,
        expandedCharity: null,
        displayedOccasions: [],
        archivedOccasions: [],
        setShowForm: () => {},
        setSearchTerm: () => {},
        setIsEditing: () => {},
        setEditingId: () => {},
        handleCreateOrUpdateOccasion: () => {},
        deleteOccasionHandler: () => {},
        setShowArchived: () => {},
        toggleAccordion: () => {},
      };

  const form = useForm<z.infer<typeof occasionSchema>>({
    resolver: zodResolver(occasionSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "other",
      charities: [],
    },
  });

  useEffect(() => {
    form.setValue(
      "charities",
      selectedCharities.map((charity) => ({
        every_id: charity.every_id || "",
        name: charity.name,
      }))
    );

    if (form.formState.isSubmitted) {
      form.trigger("charities");
    }
  }, [selectedCharities, form, form.formState.isSubmitted]);

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
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-8"
        >
          <form onSubmit={form.handleSubmit(handleCreateOrUpdateOccasion)}>
            <div className="space-y-8">
              <div>
                <input
                  {...form.register("name")}
                  placeholder="Occasion name"
                  className="w-full text-2xl font-bold border-none focus:ring-0 px-0 placeholder-gray-400"
                />
                {form.formState.errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <textarea
                    {...form.register("description")}
                    placeholder="Description"
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:ring-1 focus:ring-black"
                  />
                  {form.formState.errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.description.message}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Occasion Category
                  </label>
                  <select
                    {...form.register("type")}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:ring-1 focus:ring-black bg-gray-100"
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
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date & Time
                  </label>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      {...form.register("start")}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:ring-1 focus:ring-black bg-gray-100"
                    />
        
                  </div>
                  {form.formState.errors.start && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.start.message}
                    </p>
                  )}
                </div>

                <div className="w-full mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date & Time
                  </label>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      {...form.register("end")}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:ring-1 focus:ring-black bg-gray-100"
                    />
                  </div>
                  {form.formState.errors.end && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.end.message}
                    </p>
                  )}
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
                <p className="block text-sm font-medium text-gray-700 mb-1">
                  {favorites.length > 0
                    ? "Search for charities to add to your occasion or add from your favourites below."
                    : "Search for charities to add to your occasion."}
                </p>
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

                {favorites.length > 0 && (
                  <motion.div layout className="space-y-4">
                    <h3 className="font-medium text-gray-900 flex items-center gap-2">
                      <Heart size={16} className="text-red-500" />
                      Favorite Charities
                    </h3>
                    <div className="grid gap-3">
                      {favorites.map((charity: Charity) => (
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
                          isSelected={true}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No charities selected yet.</p>
                  )}
                  {form.formState.errors.charities && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.charities.message}
                    </p>
                  )}
                </motion.div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setIsEditing(false);
                    setEditingId(null);
                    setSearchTerm("");
                    setSelectedCharities([]);
                    form.reset();
                    window.scrollTo(0, 0);
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
          <h1 className="text-2xl font-semibold px-3 py-4">
            {showArchived ? "Archived Occasions" : "Occasions"}
          </h1>
          {displayedOccasions.map((occasion) => (
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
                  <h3 className="text-xl font-semibold text-gray-900 w-40 overflow-auto">
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
                  {occasion.charities.map((charity) => (
                    <div key={charity.every_slug}>
                      {charity.donations && charity.donations.length > 0 && (
                        <div className="mt-6">
                          <button
                            onClick={() => toggleAccordion(charity.every_slug)}
                            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <span className="text-sm">Donations</span>

                            <ChevronDown
                              className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                                expandedCharity === charity.every_slug
                                  ? "rotate-180"
                                  : ""
                              }`}
                            />
                          </button>

                          <AnimatePresence>
                            {expandedCharity === charity.every_slug && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="mt-4 space-y-3 px-1">
                                  {charity.donations.map((donation) => (
                                    <div
                                      key={donation._id}
                                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                                    >
                                      <span className="font-medium text-sm">
                                        {donation.donor_name || "Anonymous"}
                                      </span>

                                      <div className="flex items-center space-x-4 text-sm">
                                        <span className="text-gray-700 font-medium">
                                          ${donation.amount.toLocaleString()}
                                        </span>
                                        <span className="text-gray-500">
                                          {new Date(
                                            donation.created_at
                                          ).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                          })}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  ))}
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
                  {new Date(occasion.end) > new Date() &&
                    new Date(occasion.start) > new Date() && (
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
                            format(
                              new Date(occasion.start),
                              "yyyy-MM-dd'T'HH:mm"
                            )
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
                    )}
                  {new Date(occasion.end) > new Date() && (
                    <motion.button
                      whileHover={{
                        scale: 1.05,
                      }}
                      whileTap={{
                        scale: 0.95,
                      }}
                      onClick={() => deleteOccasionHandler(occasion._id || "")}
                      className="p-2 text-red-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 size={20} />
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          {!showArchived && (
            <button
              onClick={() => {
                setShowForm(true);
                setIsEditing(false);
                setEditingId(null);
                setSearchTerm("");
                setSelectedCharities([]);
                form.reset();
              }}
              className="inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-all w-full sm:w-64 mx-auto"
            >
              Create another occasion
            </button>
          )}
          {archivedOccasions.length > 0 && (
            <button
              onClick={() => setShowArchived(!showArchived)}
              className="flex items-center justify-center px-6 py-3 text-gray-700 border border-gray-300 rounded-full hover:bg-gray-100 w-full sm:w-64 mx-auto"
            >
              {showArchived
                ? "View Active Occasions"
                : "View Archived Occasions"}
            </button>
          )}
        </motion.div>
      )}
    </Layout>
  );
}
