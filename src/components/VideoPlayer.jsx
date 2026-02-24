import { useEffect, useRef, useState } from "react";
import { usePlayer } from "../context/PlayerContext";
import { useWatchHistory } from "../context/WatchHistoryContext";

export default function VideoPlayer() {
  const { activeMovie, stopMovie } = usePlayer();
  const { updateWatchTime } = useWatchHistory();
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  const lastClickRef = useRef(0);

  const [loading, setLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const isMobile = window.innerWidth < 768;

  // Track watch history
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !activeMovie) return;

    const handleTimeUpdate = () => {
      if (video.duration) {
        updateWatchTime(activeMovie.id, video.currentTime, video.duration);
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, [activeMovie, updateWatchTime]);

  // Main video setup
  useEffect(() => {
    if (!activeMovie || !videoRef.current) return;

    const video = videoRef.current;
    setLoading(true);
    setShowControls(true);

    video.src = activeMovie.streamUrl;

    const handleLoadedData = () => {
      setLoading(false);
      setDuration(video.duration);
    };

    const handleError = (e) => {
      setLoading(false);
      console.error("Stream failed to load:", e);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setTimeout(() => {
        stopMovie();
      }, 1000);
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("error", handleError);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);

    video.play().catch((err) => console.error("Play error:", err));

    return () => {
      video.pause();
      video.currentTime = 0;

      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("error", handleError);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
    };
  }, [activeMovie, stopMovie]);

  const handleMouseMove = () => {
    setShowControls(true);

    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    hideTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 2000);
  };

  const handleVideoClick = (e) => {
    const now = Date.now();
    const timeSinceLastClick = now - lastClickRef.current;

    if (timeSinceLastClick < 300) {
      e.stopPropagation();
      if (videoRef.current) {
        if (videoRef.current.paused) {
          videoRef.current.play();
        } else {
          videoRef.current.pause();
        }
      }
      lastClickRef.current = 0;
    } else {
      lastClickRef.current = now;
      setShowControls(true);

      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }

      hideTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2000);
    }
  };

  const handleBackClick = () => {
    stopMovie();
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        stopMovie();
      }
      if (e.key === " ") {
        e.preventDefault();
        if (videoRef.current) {
          if (videoRef.current.paused) {
            videoRef.current.play();
          } else {
            videoRef.current.pause();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [stopMovie]);

  if (!activeMovie) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black z-50"
      onMouseMove={handleMouseMove}
      onClick={handleVideoClick}
    >
      {/* Loading shimmer */}
      {loading && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse z-10" />
      )}

      {/* Back Button */}
      <div
        className={`absolute top-4 left-4 z-40 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        } ${isMobile ? "top-3 left-3" : ""}`}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleBackClick();
          }}
          className={`bg-black/60 text-white rounded-full hover:bg-black/80 transition backdrop-blur-sm ${
            isMobile ? "p-2" : "p-3"
          }`}
        >
          <svg className={`fill-none stroke-current stroke-2 ${isMobile ? "w-5 h-5" : "w-6 h-6"}`} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Video */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain relative z-20"
        style={{
          cursor: showControls ? "auto" : "none",
        }}
      />

      {/* Custom Controls Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-30 transition-opacity duration-300 bg-gradient-to-t from-black/80 to-transparent ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onMouseEnter={() => !isMobile && setShowControls(true)}
        onMouseLeave={() => {
          if (isMobile) return;
          if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
          hideTimeoutRef.current = setTimeout(() => {
            if (videoRef.current && !videoRef.current.paused) {
              setShowControls(false);
            }
          }, 2000);
        }}
      >
        <div className={`${isMobile ? "px-4 py-3" : "px-6 py-4"}`}>
          {/* Progress Bar */}
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={(e) => {
              if (videoRef.current) {
                videoRef.current.currentTime = e.target.value;
              }
            }}
            className={`w-full bg-gray-600 rounded cursor-pointer accent-[#e50914] ${
              isMobile ? "h-1 mb-2" : "h-1 mb-3"
            }`}
            onClick={(e) => e.stopPropagation()}
          />

          {/* Controls Row - Responsive Grid */}
          <div className={`flex ${isMobile ? "flex-col gap-3" : "items-center justify-between gap-4"}`}>
            {/* Left Controls */}
            <div className={`flex items-center ${isMobile ? "gap-3" : "gap-4"}`}>
              {/* Play/Pause */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (videoRef.current) {
                    if (videoRef.current.paused) {
                      videoRef.current.play();
                    } else {
                      videoRef.current.pause();
                    }
                  }
                }}
                className="text-white hover:text-[#e50914] transition"
              >
                {isPlaying ? (
                  <svg className={`fill-current ${isMobile ? "w-5 h-5" : "w-6 h-6"}`} viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 012-2h6a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V3z" />
                  </svg>
                ) : (
                  <svg className={`fill-current ${isMobile ? "w-5 h-5" : "w-6 h-6"}`} viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                )}
              </button>

              {/* Volume */}
              <div className="flex items-center gap-2">
                <button className="text-white hover:text-[#e50914] transition">
                  {volume === 0 ? (
                    <svg className={`fill-current ${isMobile ? "w-4 h-4" : "w-5 h-5"}`} viewBox="0 0 24 24">
                      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C23.1 14.69 24 12.61 24 10c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                    </svg>
                  ) : volume < 0.5 ? (
                    <svg className={`fill-current ${isMobile ? "w-4 h-4" : "w-5 h-5"}`} viewBox="0 0 24 24">
                      <path d="M7 9v6h4l5 5V4l-5 5H7z" />
                    </svg>
                  ) : (
                    <svg className={`fill-current ${isMobile ? "w-4 h-4" : "w-5 h-5"}`} viewBox="0 0 24 24">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.26 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                    </svg>
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume * 100}
                  onChange={(e) => {
                    const vol = e.target.value / 100;
                    setVolume(vol);
                    if (videoRef.current) {
                      videoRef.current.volume = vol;
                    }
                  }}
                  className={`bg-gray-600 rounded cursor-pointer accent-[#e50914] ${isMobile ? "w-16 h-1" : "w-20 h-1"}`}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {/* Time Display - Hidden on very small screens */}
              {!isMobile && (
                <span className="text-white text-sm ml-4 min-w-fit">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              )}
            </div>

            {/* Right Controls */}
            <div className={`flex items-center ${isMobile ? "justify-between w-full" : "gap-4"}`}>
              {/* Time Display - Mobile */}
              {isMobile && (
                <span className="text-white text-xs">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              )}

              {/* Speed */}
              <select
                onChange={(e) => {
                  if (videoRef.current) {
                    videoRef.current.playbackRate = parseFloat(e.target.value);
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                className={`bg-black/60 text-white rounded hover:bg-black/80 transition ${
                  isMobile ? "text-xs px-1 py-0.5" : "text-sm px-2 py-1"
                }`}
              >
                <option value="0.5">0.5x</option>
                <option value="1">1x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2x</option>
              </select>

              {/* Fullscreen */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (videoRef.current) {
                    if (videoRef.current.requestFullscreen) {
                      videoRef.current.requestFullscreen();
                    }
                  }
                }}
                className="text-white hover:text-[#e50914] transition flex items-center justify-center"
                title="Fullscreen"
              >
                <span className={isMobile ? "text-base" : "text-lg"}>⛶</span>
              </button>

              {/* PIP Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (videoRef.current) {
                    if (document.pictureInPictureEnabled) {
                      if (document.pictureInPictureElement) {
                        document.exitPictureInPicture();
                      } else {
                        videoRef.current.requestPictureInPicture();
                      }
                    }
                  }
                }}
                className="text-white hover:text-[#e50914] transition"
                title="Picture in Picture"
              >
                <svg className={`fill-none stroke-current ${isMobile ? "w-4 h-4" : "w-5 h-5"}`} strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M7 16V4m0 0L3 8m4-4l4 4h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h6l4-4z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}