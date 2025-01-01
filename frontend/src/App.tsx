import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import UserProfile from "./pages/UserProfile";
import Occasions from "./pages/Occasions";
import SearchCharities from "./pages/SearchCharities";
import FavoriteCharities from "./pages/FavouriteCharities";
import PublicOccasion from "./pages/PublicOccasion";
import Statistics from "./pages/Stastistics";

export default function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}
