import { createContext, useContext, useState } from "react";

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [hoveredMovieId, setHoveredMovieId] = useState(null);
  const [activeMovie, setActiveMovie] = useState(null);
  const [heroMovie, setHeroMovie] = useState(null);

  const handleHover = (id) => {
    setHoveredMovieId(id);
  };

  const clearHover = () => {
    setHoveredMovieId(null);
  };

  const playMovie = (movie) => {
    setActiveMovie(movie);
  };

  const stopMovie = () => {
    setActiveMovie(null);
  };

  const setHoveredHero = (movie) => {
    setHeroMovie(movie);
  };

  const clearHoveredHero = () => {
    setHeroMovie(null);
  };

  return (
    <PlayerContext.Provider
      value={{
        hoveredMovieId,
        activeMovie,
        heroMovie,
        handleHover,
        clearHover,
        playMovie,
        stopMovie,
        setHoveredHero,
        clearHoveredHero,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  return useContext(PlayerContext);
};