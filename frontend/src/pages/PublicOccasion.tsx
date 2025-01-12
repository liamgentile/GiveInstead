import { User, Gift, Calendar, Share2, CheckCircle } from "lucide-react";
import { useParams } from "react-router-dom";
import { usePublicOccasion } from "../hooks/usePublicOccasion";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import { useEffect, useRef } from "react";

export default function PublicOccasion() {
  const { url } = useParams<{ url: string }>();

  const EVERY_DOT_ORG_BASE_URL = import.meta.env.VITE_EVERY_DOT_ORG_BASE_URL;
  const EVERY_DOT_ORG_WEBHOOK_KEY = import.meta.env.VITE_EVERY_DOT_ORG_WEBHOOK_KEY;

  const {
    occasion,
    totalProgress,
    hostName,
    copied,
    handleShareClick,
  } = url
    ? usePublicOccasion(url)
    : {
        occasion: null,
        totalProgress: 0,
        hostName: null,
        copied: false,
        handleShareClick: () => {},
      };

  const now = new Date();
  const hasStarted = occasion && now >= new Date(occasion.start);
  const hasEnded = occasion && now > new Date(occasion.end);

  const showDonationToast = (donorName: string, amount: number, charityName: string) => {
    toast.info(
      `${donorName} donated $${amount.toLocaleString()} to ${charityName}! 🎉`,
      { position: "bottom-right", autoClose: 5000 }
    );
  };

  const lastDonationDateRef = useRef<Date | null>(null);

  useEffect(() => {
    if (occasion && occasion.charities) {
      const allDonations = occasion.charities.flatMap((charity) =>
        charity.donations?.map((donation) => ({
          ...donation,
          charityName: charity.name,
        })) || []
      );

      const mostRecentDonation = allDonations
        .filter((donation) => donation.created_at)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

      if (mostRecentDonation) {
        const { donor_name, amount, charityName, created_at } = mostRecentDonation;

        if (created_at !== lastDonationDateRef.current) {
          showDonationToast(donor_name, amount, charityName);
          lastDonationDateRef.current = created_at; 
        }
      }
    }
  }, [occasion]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
       <ToastContainer className="w-11/12 sm:w-auto m-auto sm:m-0" />
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

            {hasStarted ? (
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
            ) : (
              <p className="mt-10 pt-8 border-t border-gray-100 text-gray-600 text-center">
                This occasion hasn&apos;t started yet, check back on{" "}
                {format(new Date(occasion.start), "MMM d, yyyy 'at' h:mm a")}.
              </p>
            )}
          </motion.div>

          <h2 className="text-xl sm:text-2xl m-auto text-center font-semibold text-gray-900 mb-6">
            Supported Charities
          </h2>

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

                  {hasStarted && !hasEnded && (
                    <a
                      href={`${EVERY_DOT_ORG_BASE_URL}/${charity.every_slug}?webhook_token=${EVERY_DOT_ORG_WEBHOOK_KEY}&partner_donation_id=${occasion._id}#donate`}
                      target="_blank"
                      className="inline-block mt-4 px-6 py-3 bg-green-700 text-white rounded-full hover:bg-green-600 transition-colors"
                    >
                      Donate Now
                    </a>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </main>
      )}
    </div>
  );
}
