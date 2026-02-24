import { useState, useRef } from "react";
import { usePlayer } from "../context/PlayerContext";

export default function MovieCard({ movie }) {
  const { setHoveredHero, clearHoveredHero, playMovie } = usePlayer();
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showControls, setShowControls] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const previewVideoRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  const isMobile = window.innerWidth < 768;

  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsHovered(true);
      setHoveredHero(movie);
      setShowControls(true);
      setShowDescription(false);
      if (previewVideoRef.current) {
        setTimeout(() => {
          previewVideoRef.current?.play().catch(() => {});
        }, 300);
      }
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsHovered(false);
      clearHoveredHero();
      setShowControls(false);
      setShowDescription(false);
      if (previewVideoRef.current) {
        previewVideoRef.current.pause();
        previewVideoRef.current.currentTime = 0;
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!isHovered) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y });
  };

  const handlePIPMouseMove = () => {
    setShowControls(true);
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    hideTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 2000);
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    const link = document.createElement("a");
    link.href = movie.trailer;
    link.download = `${movie.title}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="relative cursor-pointer overflow-hidden rounded-lg transition-all duration-300 ease-out hover:scale-125 hover:shadow-2xl group w-full h-full"
      style={{
        boxShadow: isHovered ? "0 20px 40px rgba(229, 9, 20, 0.5)" : "none",
        zIndex: isHovered ? 50 : 0,
        aspectRatio: "2/3",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onClick={() => playMovie(movie)}
    >
      {/*segment for Poster Container */}
      <div className="relative w-full h-full overflow-hidden rounded-lg">
        <img
          src={movie.poster}
          alt={movie.title}
          className={`w-full h-full object-cover transition-transform duration-75 ${
            isHovered ? "scale-150" : "scale-100"
          }`}
          style={
            isHovered
              ? {
                  transformOrigin: `${mousePos.x}px ${mousePos.y}px`,
                }
              : {}
          }
        />

        {/*segment for Lens Circle Overlay */}
        {isHovered && (
          <div
            className="absolute w-20 h-20 border-3 border-white rounded-full pointer-events-none z-20"
            style={{
              left: `${mousePos.x - 40}px`,
              top: `${mousePos.y - 40}px`,
              boxShadow: "0 0 20px rgba(255,255,255,0.6), inset 0 0 10px rgba(255,255,255,0.3)",
            }}
          />
        )}

        {/*segment for Red Border on Hover */}
        <div
          className={`absolute inset-0 rounded-lg pointer-events-none transition-all duration-300 z-10 ${
            isHovered ? "border-2 border-[#e50914]" : "border-2 border-transparent"
          }`}
        />

        {/*segment for Movie Details - Text Only, No Background */}
        {isHovered && (
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between p-3 z-30 animate-slide-in">
            {/*this is display Certificate, Genre, and Year */}
            <div className="flex items-center gap-2 flex-wrap">
              {/*this is display Certificate Badge */}
              <div className="bg-white text-[#e50914] px-2 py-1 rounded font-bold text-sm">
                {movie.certificate}
              </div>

              {/*segment for Genre with same background */}
              <div className="bg-white text-[#e50914] px-2 py-1 rounded font-bold text-xs">
                {movie.genre}
              </div>

              {/* this is display Year with same background */}
              <div className="bg-white text-[#e50914] px-2 py-1 rounded font-bold text-xs">
                {movie.year}
              </div>
            </div>

            {/* this is display Play Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                playMovie(movie);
              }}
              className="w-24 bg-[#e50914] text-white py-1 rounded font-bold hover:bg-[#f40612] transition text-xs mt-2"
            >
              ▶ PLAY
            </button>
          </div>
        )}
      </div>

      {/*area for  PIP Preview Window - Centered Inside Card */}
      {isHovered && (
        <div
          className="absolute inset-0 flex items-center justify-center z-40 animate-expand"
          onMouseMove={handlePIPMouseMove}
        >
          <div className="w-96 h-80 rounded-lg overflow-hidden border-2 border-[#e50914] shadow-2xl bg-black flex flex-col">
            {/*area for  Video Container */}
            <div className="relative flex-1 overflow-hidden" onMouseMove={handlePIPMouseMove}>
              <video
                ref={previewVideoRef}
                src={movie.trailer}
                muted
                loop
                autoPlay
                onMouseMove={handlePIPMouseMove}
                className="w-full h-full object-cover"
              />

              {/*area for Movie Info Overlay - Top Left (Horizontal) */}
              <div className="absolute top-3 left-3 z-20 flex items-center gap-3">
                {/* Certificate */}
                <div className="bg-white text-[#e50914] px-2 py-1 rounded font-bold text-xs">
                  {movie.certificate}
                </div>
                {/*  this will display Genre */}
                <p className="text-white text-xs font-bold">{movie.genre}</p>
                {/*this will display Year */}
                <p className="text-gray-300 text-xs">{movie.year}</p>
              </div>

              {/*this will display Play Button - Center */}
              {previewVideoRef.current?.paused && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    previewVideoRef.current?.play();
                  }}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/60 transition"
                >
                  <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </button>
              )}
            </div>

            {/* Action Buttons - Below Video */}
            <div className="px-3 py-2 space-y-2">
              {/* Download and Description Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleDownload}
                  className="flex-1 bg-black border-2 border-white text-white py-1.5 rounded-lg font-bold text-xs hover:bg-white/10 transition flex items-center justify-center gap-2"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDescription(!showDescription);
                  }}
                  className="flex-1 bg-black border-2 border-white text-white py-1.5 rounded-lg font-bold text-xs hover:bg-white/10 transition"
                >
                  Description
                </button>
              </div>

              {/* Description Text - Appears Below Buttons */}
              {showDescription && (
                <div className="bg-black/50 border border-white/30 rounded-lg px-3 py-2 animate-expand max-h-20 overflow-y-auto space-y-2">
                  <p className="text-white text-xs leading-snug">{movie.description}</p>
                  <p className="text-gray-300 text-xs">
                    <span className="font-bold">Starring:</span> {movie.stars}
                  </p>
                </div>
              )}
            </div>

            {/* Controls - Bottom of PIP */}
            <div
              className={`transition-opacity duration-300 bg-gradient-to-t from-black/90 to-transparent p-2 ${
                showControls ? "opacity-100" : "opacity-0"
              }`}
            >
              {/* Progress Bar */}
              <input
                type="range"
                min="0"
                max={previewVideoRef.current?.duration || 0}
                value={previewVideoRef.current?.currentTime || 0}
                onChange={(e) => {
                  if (previewVideoRef.current) {
                    previewVideoRef.current.currentTime = e.target.value;
                  }
                }}
                className="w-full h-0.5 bg-gray-600 rounded cursor-pointer accent-[#e50914]"
                onClick={(e) => e.stopPropagation()}
              />

              {/* Play/Pause Button */}
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (previewVideoRef.current) {
                      if (previewVideoRef.current.paused) {
                        previewVideoRef.current.play();
                      } else {
                        previewVideoRef.current.pause();
                      }
                    }
                  }}
                  className="text-white hover:text-[#e50914] transition"
                >
                  {previewVideoRef.current?.paused ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 012-2h6a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V3z" />
                    </svg>
                  )}
                </button>

                {/* Time Display */}
                <span className="text-white text-xs">
                  {previewVideoRef.current
                    ? `${Math.floor(previewVideoRef.current.currentTime / 60)}:${String(
                        Math.floor(previewVideoRef.current.currentTime % 60)
                      ).padStart(2, "0")}`
                    : "0:00"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }

        @keyframes expand {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-expand {
          animation: expand 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
