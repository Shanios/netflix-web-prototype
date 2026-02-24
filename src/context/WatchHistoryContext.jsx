import { createContext, useContext, useState, useEffect } from "react";

const WatchHistoryContext = createContext();

export const WatchHistoryProvider = ({ children }) => {
  const [watchHistory, setWatchHistory] = useState([]);

  //this will Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("watchHistory");
    if (saved) {
      setWatchHistory(JSON.parse(saved));
    }
  }, []);

  //now saves save to localStorage
  useEffect(() => {
    localStorage.setItem("watchHistory", JSON.stringify(watchHistory));
  }, [watchHistory]);

  const updateWatchTime = (movieId, currentTime, duration) => {
    //we will Only save if video is 5% - 95% watched (not completed, not just started)
    const watchPercentage = (currentTime / duration) * 100;
    
    if (watchPercentage >= 5 && watchPercentage < 95) {
      setWatchHistory((prev) => {
        const existing = prev.find((item) => item.movieId === movieId);
        
        if (existing) {
          return prev.map((item) =>
            item.movieId === movieId
              ? {
                  ...item,
                  currentTime,
                  duration,
                  lastWatched: new Date().toISOString(),
                }
              : item
          );
        } else {
          return [
            ...prev,
            {
              movieId,
              currentTime,
              duration,
              lastWatched: new Date().toISOString(),
            },
          ];
        }
      });
    }
  };

  const getWatchProgress = (movieId) => {
    const item = watchHistory.find((h) => h.movieId === movieId);
    return item
      ? {
          currentTime: item.currentTime,
          duration: item.duration,
          percentage: (item.currentTime / item.duration) * 100,
        }
      : null;
  };

  const getContinueWatchingMovies = (allMovies) => {
    return watchHistory
      .filter((h) => (h.currentTime / h.duration) * 100 < 95)
      .map((h) => {
        const movie = allMovies.find((m) => m.id === h.movieId);
        return { ...movie, ...h };
      })
      .filter((m) => m)
      .sort(
        (a, b) =>
          new Date(b.lastWatched) - new Date(a.lastWatched)
      );
  };

  return (
    <WatchHistoryContext.Provider
      value={{
        watchHistory,
        updateWatchTime,
        getWatchProgress,
        getContinueWatchingMovies,
      }}
    >
      {children}
    </WatchHistoryContext.Provider>
  );
};

export const useWatchHistory = () => {
  return useContext(WatchHistoryContext);
};
