import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import UserProfile from "./pages/UserProfile";
import Occasions from "./pages/Occasions";
import SearchCharities from "./pages/SearchCharities";

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
        <Route path="/user-profile" element={<UserProfile />}></Route>
        <Route path="/search-charities" element={<SearchCharities />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
