import { useEffect, useState } from "react";
import { PlayerProvider } from "./context/PlayerContext";
import { SearchProvider } from "./context/SearchContext";
import { WatchHistoryProvider } from "./context/WatchHistoryContext";
import MovieGrid from "./components/MovieGrid";
import VideoPlayer from "./components/VideoPlayer";

import { usePlayer } from "./context/PlayerContext";
import HeroBanner from "./components/HeroBanner";
import Navbar from "./components/Navbar";

function Layout() {
  const { activeMovie } = usePlayer();
  const [currentPage, setCurrentPage] = useState("home");

  useEffect(() => {
    if (activeMovie) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [activeMovie]);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {!activeMovie && <Navbar onPageChange={setCurrentPage} currentPage={currentPage} />}

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black z-0" />

      <div className="relative z-10 pt-20">
        {currentPage === "home" && (
          <div
            className={`transition-opacity duration-500 ${
              activeMovie ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <HeroBanner />
            <MovieGrid />
          </div>
        )}

        {/* {currentPage === "mylist" && (
          <div
            className={`transition-opacity duration-500 ${
              activeMovie ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <MyList />
          </div>
        )} */}

        <div
          className={`transition-opacity duration-500 ${
            activeMovie ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <VideoPlayer />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <PlayerProvider>
      <SearchProvider>
        <WatchHistoryProvider>
          <Layout />
        </WatchHistoryProvider>
      </SearchProvider>
    </PlayerProvider>
  );
}