import { useEffect, useState, useRef } from "react";
import movies from "../assets/movies";
import { usePlayer } from "../context/PlayerContext";

export default function HeroBanner() {
  const { playMovie, heroMovie, clearHoveredHero } = usePlayer();
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const videoRef = useRef(null);

  // Auto-rotation (pauses when heroMovie is set)
  useEffect(() => {
    if (heroMovie) return; // Pause rotation when hovering

    const interval = setInterval(() => {
      setFade(false); // start fade out

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % movies.length);
        setFade(true); // fade in new content
      }, 400); // fade duration
    }, 5000);

    return () => clearInterval(interval);
  }, [heroMovie]);

  // Hero trailer playback
  useEffect(() => {
    if (!heroMovie || !videoRef.current) return;

    const video = videoRef.current;

    // Direct MP4 playback (no HLS)
    video.src = heroMovie.trailer;
    video.play().catch(() => {});

    return () => {
      video.pause();
      video.currentTime = 0;
    };
  }, [heroMovie]);

  const featured = heroMovie || movies[index];

  return (
    <div 
      className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 50%, #1a0000 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Netflix Grid Pattern Background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(0deg, transparent 24%, rgba(255, 0, 0, 0.15) 25%, rgba(255, 0, 0, 0.15) 26%, transparent 27%, transparent 74%, rgba(255, 0, 0, 0.15) 75%, rgba(255, 0, 0, 0.15) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(255, 0, 0, 0.15) 25%, rgba(255, 0, 0, 0.15) 26%, transparent 27%, transparent 74%, rgba(255, 0, 0, 0.15) 75%, rgba(255, 0, 0, 0.15) 76%, transparent 77%, transparent)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Radial Glow Effect */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: "radial-gradient(ellipse at center, rgba(229, 9, 20, 0.2) 0%, transparent 70%)",
        }}
      />

      {/* Content Container */}
      <div className="relative w-full h-full">
        {/* Background Image/Video */}
        {heroMovie ? (
          <video
            key={featured.id}
            ref={videoRef}
            muted
            loop
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              fade ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : (
          <img
            key={featured.id}
            src={featured.poster}
            alt={featured.title}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              fade ? "opacity-40" : "opacity-0"
            }`}
          />
        )}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />

        {/* Netflix Red Accent Line */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#e50914] via-[#e50914]/50 to-transparent" />
      </div>

      {/* Text Content */}
      <div
        className={`absolute bottom-10 left-8 max-w-lg transition-opacity duration-500 z-10 ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      >
        <h1 className="text-5xl font-black mb-4 drop-shadow-lg">{featured.title}</h1>

        <p className="text-gray-200 mb-6 text-lg drop-shadow-md">
          Watch now and experience immersive streaming like Netflix.
        </p>

 <button
  onClick={() => playMovie(featured)}
  className="group relative px-8 py-3 font-bold text-white overflow-hidden rounded-lg transition-all duration-300"
  style={{
    background: "linear-gradient(135deg, #e50914 0%, #f40612 100%)",
    boxShadow: "0 8px 25px rgba(229, 9, 20, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
  }}
>
  {/* Animated Background Glow */}
  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    style={{
      background: "radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)",
    }}
  />

  {/* Shimmer Effect on Hover */}
  <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300"
    style={{
      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
      animation: "shimmer 2s infinite",
    }}
  />

  {/* Content */}
  <div className="relative flex items-center gap-3">
    <svg className="w-6 h-6 fill-current group-hover:scale-125 transition-transform duration-300" viewBox="0 0 20 20">
      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
    </svg>
    <span className="text-lg tracking-wider group-hover:tracking-widest transition-all duration-300">
      Play
    </span>
  </div>

  {/* Hover Border Glow */}
  <div className="absolute inset-0 rounded-lg border-2 border-white opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
</button>
      </div>
    </div>
  );
}