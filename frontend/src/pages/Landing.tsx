import { SignInButton, SignUpButton } from "@clerk/clerk-react";

import { Gift, Heart, Share2, ArrowRight } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen">
      <header className="relative bg-white py-12 px-6 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <nav className="flex justify-between items-center mb-16">
            <div className="flex space-x-2 text-center">
              <Gift className="h-6 w-6 text-green-600 my-auto" />
              <div className="text-xl font-bold">GiveInstead</div>
            </div>
            <div className="sm:px-6 py-2 text-green-800 hover:bg-green-100 rounded-full transition-colors">
              <SignInButton />
            </div>
          </nav>
          <div className="text-center md:py-20">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              We don't need more stuff.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Transform your special occasions into meaningful charitable giving
            </p>
            <SignUpButton>
              <button className="mt-8 px-8 py-4 bg-green-800 text-white rounded-full font-medium hover:bg-green-900 transition-colors flex items-center mx-auto gap-2">
                Get Started <ArrowRight size={20} />
              </button>
            </SignUpButton>
          </div>
        </div>
      </header>
      <section className="py-16 px-6 sm:px-8 lg:px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <Gift className="h-12 w-12 text-green-800 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Create Your Occasion</h3>
            <p className="text-gray-600">
              Set up your giving campaign in minutes for any special occasion
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm">
            <Heart className="h-12 w-12 text-green-800 mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Choose Your Charities
            </h3>
            <p className="text-gray-600">
              Select from thousands of charitable organizations compiled by
              Every.org
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm">
            <Share2 className="h-12 w-12 text-green-800 mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Share With Loved Ones
            </h3>
            <p className="text-gray-600">
              Invite friends and family to contribute to causes you care about
            </p>
          </div>
        </div>
      </section>
      <footer className="bg-white border-t border-gray-200">
        <p className="text-gray-600 text-center py-10">
          &copy; 2024 GiveInstead. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
