import { useEffect, useState } from "react";
import { usePlayer } from "../context/PlayerContext";
import { useSearch } from "../context/SearchContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { stopMovie } = usePlayer();
  const { handleSearch, clearSearch } = useSearch();
  const [searchOpen, setSearchOpen] = useState(false);
  const [input, setInput] = useState("");

  const categories = [
    { id: "all", label: "All Movies" },
    { id: "action", label: "Action" },
    { id: "sci-fi", label: "Sci-Fi" },
    { id: "drama", label: "Drama" },
    { id: "thriller", label: "Thriller" },
    { id: "comedy", label: "Comedy" },
    { id: "horror", label: "Horror" },
    { id: "biography", label: "Biography" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleHomeClick = () => {
    stopMovie(); //this will Stop any playing movie
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top
    
    // this will Reset all filters and search
    setSelectedCategory("all"); 
    clearSearch(); 
    setInput(""); 
    setSearchOpen(false); 
    
    // Dispatch event to reset category filter
    window.dispatchEvent(
      new CustomEvent("categoryChange", { detail: { category: "all" } })
    );
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    handleSearch(value);
  };

  const handleClear = () => {
    setInput("");
    clearSearch();
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (searchOpen) {
      handleClear();
    }
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setCategoryOpen(false);
    // Dispatch category filter event
    window.dispatchEvent(
      new CustomEvent("categoryChange", { detail: { category: categoryId } })
    );
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/50 backdrop-blur-md"
          : "bg-gradient-to-b from-black/40 to-transparent"
      }`}
      style={{
        borderBottom: scrolled ? "2px solid #e50914" : "none",
      }}
    >
      <div className="flex items-center justify-between px-8 py-3">
        {/* Logo and Navigation together */}
        <div className="flex items-center gap-6">
          
          <div className="relative">
            <div className="bg-black border-2 border-[#e50914] px-3 py-1 rounded">
              <span className="text-[#e50914] font-black text-lg tracking-wide">NETFLIX</span>
            </div>
          </div>

         
          <div className="flex items-center gap-6 text-sm">
            <span
              onClick={handleHomeClick}
              className="hover:text-gray-300 cursor-pointer transition font-bold"
            >
              Home
            </span>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCategoryOpen(!categoryOpen)}
                className="hover:text-gray-300 cursor-pointer transition flex items-center gap-1 font-bold"
              >
                Categories
              </button>

              {/* Dropdown Menu */}
              {categoryOpen && (
                <div className="absolute top-full left-0 mt-2 bg-black/95 border border-[#e50914]/50 rounded-lg overflow-hidden min-w-48 z-50 animate-expand">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`w-full text-left px-4 py-2 transition ${
                        selectedCategory === cat.id
                          ? "bg-[#e50914] text-white font-bold"
                          : "text-gray-300 hover:bg-[#e50914]/20 hover:text-white"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="hover:text-gray-300 cursor-pointer transition font-bold">
              My List
            </span>
          </div>
        </div>

        {/* Search Icon */}
        <button
          onClick={toggleSearch}
          className="text-white hover:text-[#e50914] transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>

      {/* Search Input */}
      {searchOpen && (
        <div className="px-8 py-3 animate-expand">
          <div className="relative max-w-md">
            <input
              type="text"
              autoFocus
              placeholder="Search movies..."
              value={input}
              onChange={handleInputChange}
              className="w-full bg-black/40 text-white px-4 py-2 rounded border border-[#e50914] focus:outline-none"
            />
            {input && (
              <button
                onClick={handleClear}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes expand {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-expand {
          animation: expand 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
