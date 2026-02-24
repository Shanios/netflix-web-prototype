import { useEffect, useState } from "react";
import movies from "../assets/movies";
import { useWatchHistory } from "../context/WatchHistoryContext";
import MovieCard from "./MovieCard";

export default function ContinueWatchingSection() {
  const { getContinueWatchingMovies } = useWatchHistory();
  const [continueWatching, setContinueWatching] = useState([]);

  useEffect(() => {
    const items = getContinueWatchingMovies(movies);
    setContinueWatching(items);
  }, [getContinueWatchingMovies]);

  if (continueWatching.length === 0) {
    return null;
  }

  return (
    <div className="relative px-6 py-8">
      <h2 className="text-2xl font-bold mb-6 text-white">Continue Watching</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {continueWatching.map((movie) => (
          <div key={movie.movieId} className="relative">
            <MovieCard movie={movie} />
            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700 rounded-b-lg overflow-hidden">
              <div
                className="h-full bg-[#e50914] transition-all duration-300"
                style={{ width: `${movie.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}