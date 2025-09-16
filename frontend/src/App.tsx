import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { Suspense } from "react";

const Landing = React.lazy(() => import("./pages/Landing"));
const UserProfile = React.lazy(() => import("./pages/UserProfile"));
const Occasions = React.lazy(() => import("./pages/Occasions"));
const SearchCharities = React.lazy(() => import("./pages/SearchCharities"));
const FavoriteCharities = React.lazy(() => import("./pages/FavouriteCharities"));
const PublicOccasion = React.lazy(() => import("./pages/PublicOccasion"));
const Statistics = React.lazy(() => import("./pages/Stastistics"));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="p-6 max-w-4xl mx-auto">
            <div className="space-y-4">
              <div className="h-8 w-2/3 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-4/6 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        }
      >
        <Routes>
        <Route
          path="/"
          element={
            <>
              <SignedOut>
                <Landing />
              </SignedOut>
              <SignedIn>
                <Occasions />
              </SignedIn>
            </>
          }
        />
        <Route
          path="/user-profile"
          element={
            <SignedIn>
              <UserProfile />
            </SignedIn>
          }
        />
        <Route
          path="/statistics"
          element={
            <><SignedIn>
              <Statistics />
            </SignedIn><SignedOut>
                <Landing />
              </SignedOut></>
          }
        />
        <Route
          path="/search-charities"
          element={
            <><SignedIn>
              <SearchCharities />
            </SignedIn><SignedOut>
                <Landing />
              </SignedOut></>
          }
        />
        <Route
          path="/favourite-charities"
          element={
            <><SignedIn>
              <FavoriteCharities />
            </SignedIn><SignedOut>
                <Landing />
              </SignedOut></>
          }
        />
        <Route
          path="/occasions/:url"
          element={<PublicOccasion />}
        />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
