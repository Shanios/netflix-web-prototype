import { useState } from "react";
import { useSearch } from "../context/SearchContext";

export default function SearchBar() {
  const { handleSearch, clearSearch } = useSearch();
  const [input, setInput] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    handleSearch(value);
  };

  const handleClear = () => {
    setInput("");
    clearSearch();
  };

  return (
    <div className="px-6 py-4 flex items-center gap-4">
      <div className="relative flex-1 max-w-md">
        <input
          type="text"
          placeholder="Search movies..."
          value={input}
          onChange={handleInputChange}
          className="w-full bg-black/60 text-white px-4 py-2 rounded border border-[#e50914]/50 focus:border-[#e50914] focus:outline-none transition"
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
  );
}