import {
  Search,
  Heart,
  Trash2,
  PenSquare,
  Gift,
  Calendar,
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Layout from "../components/Layout";
import { useUser } from "@clerk/clerk-react";
import CharityCard from "../components/CharityCard";
import Charity from "../interfaces/Charity";
import Occasion from "../interfaces/Occasion";

const occasionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["fundraiser", "awareness", "volunteer"]),
  startDate: z.date(),
  endDate: z.date(),
  charities: z.array(
    z.object({
      charity: z.object({
        _id: z.string(),
        name: z.string(),
        description: z.string(),
      }),
      goal: z.number().min(0),
      description: z.string(),
    })
  ),
});

export default function Occasions() {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [charities, setCharities] = useState<Charity[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [favorites, setFavorites] = useState<Charity[]>([]);
  const [selectedCharities, setSelectedCharities] = useState<Charity[]>([]);
  const deleteOccasion = (id: string) => {
    setOccasions(occasions.filter((o) => o.id !== id));
  };
  const editOccasion = (id: string) => {
    const occasion = occasions.find((o) => o.id === id);
    if (occasion) {
      form.reset(occasion);
      setShowForm(true);
    }
  };
  const form = useForm<z.infer<typeof occasionSchema>>({
    resolver: zodResolver(occasionSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "fundraiser",
      charities: [],
    },
  });

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
        setFavorites(data);
      } catch (err) {
        console.error(err);
        setError("Could not load favorite charities.");
      }
    };

    if (user?.id) {
      fetchFavorites();
    }
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
            _id: '',
            every_id: charity.ein,
            name: charity.name,
            description: charity.description,
            imageUrl: charity.coverImageUrl,
            website: charity.websiteUrl,
          })
        );

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

  return (
    <Layout>
      <main className="flex-1 p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {occasions.length === 0 && !showForm ? (
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
                <form
                  onSubmit={form.handleSubmit(async (data) => {
                    setIsLoading(true);
                    try {
                      const newCampaign = {
                        id: Date.now().toString(),
                        ...data,
                      };
                      setOccasions([...occasions, newCampaign]);
                      form.reset();
                      setShowForm(false);
                    } catch (err) {
                      setError("Failed to create campaign");
                    } finally {
                      setIsLoading(false);
                    }
                  })}
                >
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
                        <option value="fundraiser">Fundraiser</option>
                        <option value="awareness">Awareness</option>
                        <option value="volunteer">Volunteer</option>
                      </select>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                          <Calendar
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            size={20}
                          />
                          <input
                            type="datetime-local"
                            {...form.register("startDate", {
                              valueAsDate: true,
                            })}
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
                            {...form.register("endDate", {
                              valueAsDate: true,
                            })}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:ring-1 focus:ring-black"
                          />
                        </div>
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

                      <AnimatePresence mode="wait">
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
                          className="space-y-8"
                        >
                          {!isLoading && !error && (
                            <motion.div layout className="space-y-4">
                              <div className="grid gap-3">
                                {charities.map((charity) => (
                                  <CharityCard
                                    key={charity._id}
                                    charity={charity}
                                    onSelect={() => {
                                      if (
                                        !selectedCharities.find(
                                          (c) => c._id === charity._id
                                        )
                                      ) {
                                        setSelectedCharities((prev) => [
                                          ...prev,
                                          charity,
                                        ]);
                                      }
                                    }}
                                    isSelected={selectedCharities.some(
                                      (c) => c._id === charity._id
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
                                  key={charity._id}
                                  charity={charity}
                                  onSelect={() => {
                                    if (
                                      !selectedCharities.find(
                                        (c) => c._id === charity._id
                                      )
                                    ) {
                                      setSelectedCharities((prev) => [
                                        ...prev,
                                        charity,
                                      ]);
                                    }
                                  }}
                                  isSelected={selectedCharities.some(
                                    (c) => c._id === charity._id
                                  )}
                                />
                              ))}
                            </div>
                          </motion.div>
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    <div className="flex justify-end gap-4 pt-6">
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
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

            {occasions.length > 0 && !showForm && (
              <motion.div layout className="grid gap-6">
                <h1 className="text-l font-semibold px-3 py-4 mb-4">
                  Your Favorite Charities
                </h1>
                {occasions.map((occasion) => (
                  <motion.div
                    key={occasion.id}
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
                          <span>
                            {format(occasion.startDate, "MMM d, yyyy")}
                          </span>
                          <span>→</span>
                          <span>{format(occasion.endDate, "MMM d, yyyy")}</span>
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
                          onClick={() => editOccasion(occasion.id)}
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
                          onClick={() => deleteOccasion(occasion.id)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash2 size={20} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </Layout>
  );
}
