"use client";

import { useEffect, useState } from "react";
import { issuesAPI, booksAPI } from "@/lib/api";
import toast from "react-hot-toast";

export default function IssuePage() {
  const [books, setBooks] = useState<any[]>([]);
  const [bookId, setBookId] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await booksAPI.getAll({ available: true });
      setBooks(res.data.results || res.data);
    } catch {
      toast.error("Failed to load books");
    }
  };

  const issueBook = async () => {
  if (!bookId) return toast.error("Select a book");

  try {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 14 days later

    await issuesAPI.create({
      book: Number(bookId),
      due_date: dueDate.toISOString().split("T")[0], // YYYY-MM-DD
    });

    toast.success("Book issued successfully");
  } catch (err: any) {
    console.error("ISSUE ERROR:", err.response?.data || err);
    toast.error(
      err.response?.data?.detail ||
      "Issue failed"
    );
  }
};


  return (
    <div className="p-6 bg-white min-h-screen border-2 border-sky-600 rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4 text-black">Issue Book</h1>

      <select
        className="border p-2 mr-2 text-black"
        value={bookId}
        onChange={(e) => setBookId(e.target.value)}
      >
        <option value="">Select Book</option>
        {books.map((b) => (
          <option key={b.id} value={b.id}>
            {b.title}
          </option>
        ))}
      </select>

      <button
        onClick={issueBook}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Issue
      </button>
    </div>
  );
}
