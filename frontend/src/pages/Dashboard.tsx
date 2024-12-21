import {
  LayoutDashboard,
  Search,
  Heart,
  User,
  PieChart,
  Menu,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";

export default function Dashboard() {
  const { user } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between lg:hidden">
        <h1 className="text-xl font-semibold text-gray-900">
          Welcome back, {user?.firstName}
        </h1>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          <Menu size={24} />
        </button>
      </header>

      <div className="flex h-[calc(100vh-56px)] lg:h-screen">
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform 
            lg:relative lg:translate-x-0 lg:shadow-none lg:block
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            transition-transform duration-200 ease-in-out lg:transition-none
          `}
        >
          <div className="h-full flex flex-col p-4">
            <div className="px-3 py-4 mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Welcome back, {user?.firstName}
              </h2>
            </div>

            <nav className="space-y-1">
              {[
                {
                  icon: LayoutDashboard,
                  name: "Campaigns",
                  href: "#",
                },
                {
                  icon: PieChart,
                  name: "Stats",
                  href: "#",
                },
                {
                  icon: Search,
                  name: "Search Charities",
                  href: "#",
                },
                {
                  icon: Heart,
                  name: "Favourite Charities",
                  href: "#",
                },
                {
                  icon: User,
                  name: "Profile",
                  href: "/user-profile",
                },
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-3 py-2 text-gray-600 rounded-md hover:bg-green-50 hover:text-green-800 group transition-colors"
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  <span>{item.name}</span>
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <main className="flex-1 p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center bg-white rounded-lg shadow-sm p-12">
              <motion.div
                className="w-64 h-64 mx-auto mb-8"
                initial={{
                  scale: 0.8,
                }}
                animate={{
                  scale: [0.8, 1, 0.8],
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <svg viewBox="0 0 200 200" fill="none">
                  <motion.path
                    d="M100 70C100 70 90 50 70 50C50 50 40 70 40 80C40 100 70 120 100 140C130 120 160 100 160 80C160 70 150 50 130 50C110 50 100 70 100 70Z"
                    fill="#dcfce7"
                    stroke="#16a34a"
                    strokeWidth="4"
                    initial={{
                      scale: 1,
                    }}
                    animate={{
                      scale: [1, 1.1, 1],
                      y: [0, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.path
                    d="M60 100H140V160H60V100Z"
                    fill="#dcfce7"
                    stroke="#16a34a"
                    strokeWidth="4"
                  />
                  <path
                    d="M95 100V160M105 100V160M60 120H140"
                    stroke="#16a34a"
                    strokeWidth="4"
                  />
                  <path
                    d="M55 90H145V100H55V90Z"
                    fill="#dcfce7"
                    stroke="#16a34a"
                    strokeWidth="4"
                  />
                  <path
                    d="M95 90H105V100H95V90Z"
                    fill="#16a34a"
                    stroke="#16a34a"
                    strokeWidth="2"
                  />
                </svg>
              </motion.div>

              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No campaigns yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start by creating your first fundraising campaign
              </p>
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-800 hover:bg-green-900">
                Create Campaign
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
