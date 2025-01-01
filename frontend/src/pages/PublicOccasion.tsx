import { User, Gift, Calendar, Share2, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import Occasion from "../interfaces/Occasion";
import { donationSchema } from "../schemas/donationSchema";
import DonateButton from "../components/DonateButton";

export default function PublicOccasion() {
  const { url } = useParams<{ url: string }>();
  const [occasion, setOccasion] = useState<Occasion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedCharity, setExpandedCharity] = useState<string | null>(null);
  const [totalProgress, setTotalProgress] = useState(0);
  const [hostName, setHostName] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleShareClick = () => {
    if (url) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const donationForm = useForm({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      name: "",
      amount: 0,
      message: "",
    },
  });

  useEffect(() => {
    if (occasion) {
      const total = occasion.charities.reduce((acc, charity) => {
        return (
          acc +
          (charity.donations?.reduce(
            (sum, donation) => sum + (donation.amount || 0),
            0
          ) || 0)
        );
      }, 0);
      setTotalProgress(total);
    }
  }, [occasion?.charities]);

  useEffect(() => {
    if (!url) return;

    const fetchOccasion = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/occasions/url/${url}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch occasion data");
        }
        const data = await response.json();

        const clerk_user_id = data.clerk_user_id;

        console.log(data);

        if (!clerk_user_id) {
          throw new Error("Failed to identify user");
        } else {
          try {
            const response = await fetch(
              `http://localhost:3000/clerk/${clerk_user_id}`
            );
            if (!response.ok) {
              throw new Error("Failed to fetch user name");
            }

            const data = await response.json();
            setHostName(data.name);
          } catch (error) {
            console.error(error);
          }
        }
        setOccasion(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOccasion();
  }, [url]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <header className="border-b bg-white/80 backdrop-blur-sm fixed top-0 w-full z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center space-x-2">
            <Gift className="h-6 w-6 text-green-600" />
            <span className="font-semibold text-gray-900">GiveInstead</span>
          </a>
          <button
            onClick={handleShareClick}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            {copied ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <Share2 className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>
      </header>

      {occasion && (
        <main className="max-w-4xl mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-12"
          >
            <h1 className="text-xl sm:text-4xl font-bold text-gray-900 mb-4">
              {occasion.name}
            </h1>
            <p className="text-gray-600 mb-6 text-m sm:text-xl">
              {occasion.description}
            </p>

            <div className="flex flex-wrap gap-4 text-sm sm:text-l text-gray-500">
              <div className="flex items-center">
                <User size={16} className="mr-2" />
                <span>Created by {hostName}</span>
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                <span>
                  {format(occasion.start, "MMM d")} -{" "}
                  {format(occasion.end, "MMM d, yyyy")}
                </span>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-gray-100">
              <div className="flex justify-between text-sm sm:text-lg mb-2">
                <span className="text-gray-600 font-medium">
                  Total Amount Raised
                </span>
                <span className="font-semibold text-sm sm:text-lg text-gray-900">
                  ${totalProgress.toLocaleString()}
                </span>
              </div>
            </div>
          </motion.div>

          <h2 className="text-xl sm:text-2xl m-auto text-center font-semibold text-gray-900 mb-6">
            Supported Charities
          </h2>

          <p className="text-m sm:text-l m-auto text-center font-semibold text-gray-500 mb-6">
            Donations are processed by Every.org.
          </p>

          <div className="grid gap-8 sm:gap-6">
            <AnimatePresence mode="wait">
              {occasion.charities.map((charity) => (
                <motion.div
                  key={charity._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl p-6 sm:p-8 border border-gray-100 hover:border-green-200 transition-colors"
                >
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {charity.name}
                    </h3>
                    <p className="text-gray-600">{charity.description}</p>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Amount Raised</span>
                      <span className="font-medium">
                        $
                        {charity.donations
                          ?.reduce(
                            (sum, donation) => sum + (donation.amount || 0),
                            0
                          )
                          .toLocaleString() || 0}
                      </span>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {expandedCharity === charity._id && (
                      <motion.form
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onSubmit={donationForm.handleSubmit(async (data) => {
                          setIsLoading(true);
                          try {
                            // Here you would handle the donation submission logic
                            // Example: POST the donation data to the server
                            console.log(data);
                          } catch (error) {
                            console.error("Error submitting donation", error);
                          } finally {
                            setIsLoading(false);
                          }
                        })}
                        className="space-y-4 border-t pt-6 mt-6"
                      >
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Your Name
                          </label>
                          <input
                            {...donationForm.register("name")}
                            className={`w-full px-4 py-2 rounded-lg border transition-colors focus:ring-2 focus:ring-green-500 ${
                              donationForm.formState.errors.name
                                ? "border-red-300 focus:ring-red-500"
                                : "border-gray-200"
                            }`}
                          />
                          {donationForm.formState.errors.name && (
                            <p className="mt-1 text-sm text-red-500">
                              {donationForm.formState.errors.name.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Amount
                          </label>
                          <input
                            type="number"
                            {...donationForm.register("amount", {
                              valueAsNumber: true,
                            })}
                            className={`w-full px-4 py-2 rounded-lg border transition-colors focus:ring-2 focus:ring-green-500 ${
                              donationForm.formState.errors.amount
                                ? "border-red-300 focus:ring-red-500"
                                : "border-gray-200"
                            }`}
                          />
                          {donationForm.formState.errors.amount && (
                            <p className="mt-1 text-sm text-red-500">
                              {donationForm.formState.errors.amount.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Message (Optional)
                          </label>
                          <textarea
                            {...donationForm.register("message")}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 transition-colors focus:ring-2 focus:ring-green-500"
                            rows={3}
                          />
                        </div>

                        {/* <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors relative overflow-hidden"
                        >
                          {isLoading ? "Processing..." : "Donate"}
                        </button> */}

                        <DonateButton
                          slug={charity.every_slug}
                          amount={Number(donationForm.getValues("amount"))}
                          disabled={
                            !donationForm.getValues("amount") ||
                            !donationForm.getValues("name") ||
                            isLoading
                          }
                        />
                      </motion.form>
                    )}
                  </AnimatePresence>

                  <button
                    onClick={() => {
                      setExpandedCharity(
                        expandedCharity === charity._id ? null : charity._id
                      );
                      if (expandedCharity === charity._id) {
                        donationForm.reset();
                      }
                    }}
                    className="mt-4 text-green-600 hover:text-green-700 font-medium text-sm"
                  >
                    {expandedCharity === charity._id ? "Close" : "Donate Now"}
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </main>
      )}
    </div>
  );
}
