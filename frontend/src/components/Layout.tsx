import {
  LayoutDashboard,
  Search,
  Heart,
  User,
  PieChart,
  Menu,
  X,
  LogOut,
} from "lucide-react";

import { useState } from "react";
import { useClerk, useUser } from "@clerk/clerk-react";

export default function Layout({ children }: { children?: React.ReactNode }) {
  const { user } = useUser();
  const { signOut } = useClerk();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function MenuIcon() {
    return isSidebarOpen ? <X size={24} /> : <Menu size={24} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between lg:hidden">
        <h1 className="text-xl font-semibold text-gray-900">
          Welcome back, {user?.firstName}
        </h1>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          <MenuIcon />
        </button>
      </header>

      <div className="flex h-[calc(100vh-56px)] justify-center lg:h-screen">
        <aside
          className={`
              fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform 
              lg:relative lg:translate-x-0 lg:shadow-none lg:block
              ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
              transition-transform duration-200 ease-in-out lg:transition-none
            `}
        >
          <div className="h-full flex flex-col p-4">
            <div className="px-3 py-4 mb-6 hidden lg:block">
              <h2 className="text-xl font-bold text-gray-900">
                Welcome back, {user?.firstName}
              </h2>
            </div>

            <nav className="space-y-1">
              <div className="text-xl font-bold pt-2 pb-6 px-3 block lg:hidden">
                GiveInstead
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
                  href: "#",
                },
                {
                  icon: Search,
                  name: "Search Charities",
                  href: "/search-charities",
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
        {children}
      </div>
    </div>
  );
}
