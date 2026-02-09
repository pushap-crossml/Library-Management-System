"use client";

import { useState } from "react";
import { booksAPI } from "@/lib/api";
import toast from "react-hot-toast";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const searchBooks = async () => {
    try {
      const res = await booksAPI.getAll({ search: query });
      setResults(res.data.results || res.data);
    } catch {
      toast.error("Search failed");
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen border-2 border-sky-600 rounded-lg p-6 ">
      <h1 className="text-2xl font-bold mb-4 text-black">Search Books</h1>

      <input
        className="border p-2 mr-2 text-black"
        placeholder="Title / Author / ISBN"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button
        onClick={searchBooks}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Search
      </button>

      <div className="mt-4">
        {results.map((b) => (
          <div key={b.id} className="border p-3 mb-2 text-black">
  {b.title}
</div>

        ))}
      </div>
    </div>
  );
}
