import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useState, useEffect } from "react";

import Home from "./pages/Home.jsx";
import Watchlist from "./pages/Watchlist.jsx";
import Navbar from "./components/Navbar.jsx";

function App() {
  const [watchlist, setWatchlist] = useState(() => {
  const savedWatchlist = localStorage.getItem("watchlist");

  return savedWatchlist
    ? JSON.parse(savedWatchlist)
    : [];
});

useEffect(() => {
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
}, [watchlist]);
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route
            path="/"
            element={
              <Home
                watchlist={watchlist}
                setWatchlist={setWatchlist}
              />
            }
          />
       <Route
            path="/watchlist"
            element={
              <Watchlist
                watchlist={watchlist}
                setWatchlist={setWatchlist}
              />
            }
          />
      </Routes>
    </BrowserRouter>
  );
}

export default App;