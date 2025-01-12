import { DollarSign, Trophy, Calendar, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Layout from "../components/Layout";
import { useUser } from "@clerk/clerk-react";
import { useStatistics } from "../hooks/useStatistics";

export default function Statistics() {
  const { user } = useUser();
  const { stats, isLoading, error } = user?.id
    ? useStatistics(user.id)
    : {
        stats: {
          lifetimeRaised: 0,
          topCharity: {
            charityName: "",
            amount: 0,
            description: "",
          },
          topOccasion: {
            occasionName: "",
            totalAmount: 0,
            startDate: new Date(),
            endDate: new Date(),
          },
        },
        isLoading: false,
        error: "We're having trouble getting your user information",
      };

  return (
    <Layout>
      {error && (
        <div className="flex items-center justify-center py-12 text-red-500 gap-2">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {!error && (
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
                    className="text-xl font-bold text-gray-900"
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
                      {stats.topCharity.charityName}
                    </p>
                    <p className="text-gray-600 font-medium mb-2">
                      ${stats.topCharity.amount}
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
                ) : stats.topOccasion.totalAmount === 0 ? (
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
                      {stats.topOccasion.occasionName}
                    </p>
                    <p className="text-gray-600 font-medium mb-2">
                      ${stats.topOccasion.totalAmount}
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
      )}
    </Layout>
  );
}
