import { useState, useEffect } from "react";
import movies from "../assets/movies";
import MovieCard from "./MovieCard";
import { useSearch } from "../context/SearchContext";
import { useWatchHistory } from "../context/WatchHistoryContext";

export default function MovieGrid() {
  const { searchQuery } = useSearch();
  const { getContinueWatchingMovies } = useWatchHistory();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [continueWatching, setContinueWatching] = useState([]);

  useEffect(() => {
    const handleCategoryChange = (e) => {
      setSelectedCategory(e.detail.category);
    };

    window.addEventListener("categoryChange", handleCategoryChange);
    return () => window.removeEventListener("categoryChange", handleCategoryChange);
  }, []);

  // Get continue watching movies
  useEffect(() => {
    const items = getContinueWatchingMovies(movies);
    setContinueWatching(items);
  }, [getContinueWatchingMovies]);

  // Filter movies based on search query and category
  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery);
    const matchesCategory =
      selectedCategory === "all" ||
      movie.genre.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div 
      className="relative px-6 py-8 min-h-screen"
      style={{
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a0505 50%, #0f0f0f 100%)",
      }}
    >
      {/* Netflix Grid Pattern Background */}
      <div 
        className="absolute inset-0 opacity-3 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(0deg, transparent 24%, rgba(229, 9, 20, 0.08) 25%, rgba(229, 9, 20, 0.08) 26%, transparent 27%, transparent 74%, rgba(229, 9, 20, 0.08) 75%, rgba(229, 9, 20, 0.08) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(229, 9, 20, 0.08) 25%, rgba(229, 9, 20, 0.08) 26%, transparent 27%, transparent 74%, rgba(229, 9, 20, 0.08) 75%, rgba(229, 9, 20, 0.08) 76%, transparent 77%, transparent)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Subtle Radial Glow Effect */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(229, 9, 20, 0.08) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Continue Watching Section */}
        {continueWatching.length > 0 && !searchQuery && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-white">Continue Watching</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {continueWatching.map((movie) => (
                <div key={movie.movieId} className="relative group h-full">
                  <div className="h-full">
                    <MovieCard movie={movie} />
                  </div>
                  {/* Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700 overflow-hidden">
                    <div
                      className="h-full bg-[#e50914] transition-all duration-300"
                      style={{ width: `${movie.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results Header */}
        {searchQuery && (
          <h2 className="text-2xl font-bold mb-6 text-[#e50914]">
            {filteredMovies.length} result{filteredMovies.length !== 1 ? "s" : ""} for "{searchQuery}"
          </h2>
        )}

        {/* No Results Message */}
        {filteredMovies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No movies found</p>
          </div>
        )}

        {/* Movies Grid */}
        {filteredMovies.length > 0 && (
          <div>
            {!searchQuery && <h1 className="text-3xl font-bold mb-8 text-white">Trending Now</h1>}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredMovies.map((movie) => (
                <div key={movie.id} className="h-full">
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}