import {
  LayoutDashboard,
  Search,
  Heart,
  User,
  PieChart,
  Menu,
  X,
  LogOut,
  Gift,
} from "lucide-react";

import { useState, useEffect } from "react";
import { useClerk, useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";

export default function Layout({ children }: { children?: React.ReactNode }) {
  const { isLoaded } = useUser();
  const { signOut } = useClerk();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSidebarOpen]);

  if (!isLoaded) {
    return (
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
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between lg:hidden">
        <div className="flex space-x-2 text-center">
          <Gift className="h-6 w-6 text-green-600 my-auto" />
          <h2 className="text-xl font-bold text-gray-900">GiveInstead</h2>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          <Menu size={24} />
        </button>
      </header>

      <div className="flex h-[calc(100vh-56px)] justify-center lg:h-screen">
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform 
            lg:relative lg:translate-x-0 lg:shadow-none lg:block
            ${isSidebarOpen ? "translate-x-0 w-full" : "-translate-x-full"}
            transition-transform duration-200 ease-in-out lg:transition-none
          `}
        >
          <div className="h-full flex flex-col p-4 relative">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-md hover:bg-gray-100 lg:hidden"
            >
              <X size={24} className="text-gray-600" />
            </button>

            <div className="px-3 py-4 mb-6 hidden lg:flex space-x-2 text-center">
              <Gift className="h-6 w-6 text-green-600 my-auto" />
              <h2 className="text-xl font-bold text-gray-900">GiveInstead</h2>
            </div>

            <nav className="space-y-1">
              <div className="text-xl font-bold pt-2 pb-6 px-3 flex space-x-2 lg:hidden">
                <Gift className="h-6 w-6 text-green-600 my-auto" />
                <h2 className="text-xl font-bold text-gray-900">GiveInstead</h2>
              </div>
              {[
                {
                  icon: LayoutDashboard,
                  name: "Occasions",
                  href: "/",
                },
                {
                  icon: PieChart,
                  name: "Stats",
                  href: "/statistics",
                },
                {
                  icon: Search,
                  name: "Explore Charities",
                  href: "/search-charities",
                },
                {
                  icon: Heart,
                  name: "Favourite Charities",
                  href: "/favourite-charities",
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
                  className={`flex items-center px-3 py-4 text-gray-600 rounded-md hover:bg-green-50 hover:text-green-800 group transition-colors ${
                    window.location.pathname === item.href ? "font-bold" : ""
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  <span>{item.name}</span>
                </a>
              ))}
              <button
                onClick={() => signOut({ redirectUrl: "/" })}
                className="w-full flex items-center px-3 py-4 text-gray-600 rounded-md hover:bg-green-50 hover:text-green-800 group transition-colors"
              >
                <LogOut className="mr-3 h-5 w-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </aside>
        <div className={`flex-1 ${isSidebarOpen ? "overflow-hidden" : ""}`}>
          <main className="flex-1 p-6 bg-gray-50">
            <div className="max-w-4xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
