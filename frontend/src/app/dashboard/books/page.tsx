"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import { booksAPI } from "@/lib/api";
import { Book } from "@/lib/types";

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await booksAPI.getAll();
      const data = res.data;

      // Handle DRF paginated or normal array response
      if (Array.isArray(data)) {
        setBooks(data);
      } else if (data && Array.isArray(data.results)) {
        setBooks(data.results);
      } else {
        setBooks([]);
      }
    } catch (err) {
      toast.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?"
    );
    if (!confirmDelete) return;

    try {
      setDeletingId(id);
      await booksAPI.delete(id);
      toast.success("Book deleted successfully 🗑️");

      // Remove deleted book from state instantly (better UX)
      setBooks((prev) => prev.filter((book) => book.id !== id));
    } catch (error) {
      toast.error("Failed to delete book");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 lg:pl-64 border-2 border-sky-400 rounded-lg">
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6">
          <h1 className="text-2xl font-bold text-gray-900">Books</h1>
          <Link
            href="/dashboard"
            className="text-sm text-primary-600 hover:underline"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="p-6">
        {books.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            No books found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {books.map((b) => (
              <div
                key={b.id}
                className="bg-sky-200 rounded-xl shadow-lg p-4"
              >
                <div className="flex items-start">
                  <div className="flex-1">
                    <h3 className="text-black font-bold text-lg">
                      {b.title}
                    </h3>

                    <p className="text-sm text-gray-600">
                      {b.authors_names?.join(", ") ||
                        (b.authors
                          ? b.authors.map((a) => a.name).join(", ")
                          : "")}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      ISBN: {b.isbn}
                    </p>

                    <p className="mt-2 text-sm text-gray-700">
                      Available: {b.available_copies} / {b.total_copies}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Link
                      href={`/dashboard/books/${b.id}`}
                      className="text-sm text-primary-600 hover:underline"
                    >
                      View
                    </Link>

                    <button
                      onClick={() => handleDelete(b.id)}
                      disabled={deletingId === b.id}
                      className="text-red-600 hover:text-red-800 transition disabled:opacity-50"
                    >
                      {deletingId === b.id ? (
                        <span className="text-xs">Deleting...</span>
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>

                  <span
                    className={`text-sm ${
                      b.is_available
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {b.is_available ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Book Button */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/dashboard/books/add"
            className="bg-sky-200 text-black px-6 py-3 rounded-lg hover:bg-sky-300"
          >
            + Add Book
          </Link>
        </div>
      </main>
    </div>
  );
}
