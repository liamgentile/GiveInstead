import { DollarSign, Trophy, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Layout from "../components/Layout";
import Stats from "../interfaces/Stats";
import { useUser } from "@clerk/clerk-react";

export default function Statistics() {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    lifetimeRaised: 0,
    topCharity: {
      name: "",
      amount: 0,
      description: "",
    },
    topOccasion: {
      name: "",
      amount: 0,
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const lifetimeRaisedResponse = await fetch(
          `http://localhost:3000/stats/lifetime-raised/${user?.id}`
        );
        const lifetimeRaised = await lifetimeRaisedResponse.json();

        const topCharityResponse = await fetch(
          `http://localhost:3000/stats/top-charity/${user?.id}`
        );
        const topCharity = await topCharityResponse.json();

        const topOccasionResponse = await fetch(
          `http://localhost:3000/stats/most-successful-occasion/${user?.id}`
        );
        const topOccasion = await topOccasionResponse.json();

        setStats({
          lifetimeRaised,
          topCharity,
          topOccasion,
        });
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user?.id]);

  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-2xl font-semibold px-3 py-4 mb-6">Statistics</h1>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              delay: 0.1,
            }}
            className="bg-white rounded-xl p-6 border border-gray-100 hover:border-green-200 transition-all shadow-sm hover:shadow-md relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-green-50/50 via-transparent to-white/30" />
            <div className="relative">
              <div className="flex items-center space-x-2 text-green-600 mb-4">
                <DollarSign className="h-5 w-5" />
                <h3 className="font-medium">Lifetime Amount Raised</h3>
              </div>
              {isLoading ? (
                <div className="h-8 bg-gray-200 rounded animate-pulse" />
              ) : (
                <motion.p
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  className="text-3xl font-bold text-gray-900"
                >
                  ${stats.lifetimeRaised}
                </motion.p>
              )}
            </div>
          </motion.div>
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              delay: 0.2,
            }}
            className="bg-white rounded-xl p-6 border border-gray-100 hover:border-green-200 transition-all shadow-sm hover:shadow-md relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-green-50/50 via-transparent to-white/30" />
            <div className="relative">
              <div className="flex items-center space-x-2 text-green-600 mb-4">
                <Trophy className="h-5 w-5" />
                <h3 className="font-medium">Top Receiving Charity</h3>
              </div>
              {isLoading ? (
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                </div>
              ) : stats.topCharity.amount === 0 ? (
                <motion.div
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                >
                  <p className="text-l font-semibold text-gray-900 mb-1">
                    no charities supported yet
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                >
                  <p className="text-xl font-semibold text-gray-900 mb-1">
                    {stats.topCharity.name}
                  </p>
                  <p className="text-black-600 font-medium mb-2">
                    ${stats.topCharity.amount}
                  </p>
                  <p className="text-sm text-gray-500">
                    {stats.topCharity.description}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              delay: 0.3,
            }}
            className="bg-white rounded-xl p-6 border border-gray-100 hover:border-green-200 transition-all shadow-sm hover:shadow-md relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-green-50/50 via-transparent to-white/30" />
            <div className="relative">
              <div className="flex items-center space-x-2 text-green-600 mb-4">
                <Calendar className="h-5 w-5" />
                <h3 className="font-medium">Most Successful Occasion</h3>
              </div>
              {isLoading ? (
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                </div>
              ) : stats.topOccasion.amount === 0 ? (
                <motion.div
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                >
                  <p className="text-l font-semibold text-gray-900 mb-1">
                    no occasions funded yet
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                >
                  <p className="text-xl font-semibold text-gray-900 mb-1">
                    {stats.topOccasion.name}
                  </p>
                  <p className="text-green-600 font-medium mb-2">
                    ${stats.topOccasion.amount}
                  </p>
                  <p className="text-sm text-gray-500">
                    {format(stats.topOccasion.startDate, "MMM d")} -{" "}
                    {format(stats.topOccasion.endDate, "MMM d, yyyy")}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
