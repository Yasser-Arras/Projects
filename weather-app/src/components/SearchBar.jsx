import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [input, setInput] = useState("");

  const handleSearch = () => {
    if (!input) return;
    onSearch(input); 
    setInput("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="flex items-center gap-4">

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKey}
        className="bg-[#102925] px-4 py-2 rounded-full w-[300px]"
        placeholder="Search city..."
      />

      <button
        onClick={handleSearch}
        className="bg-green-600 px-4 py-2 rounded-full"
      >
        Search
      </button>

    </div>
  );
}