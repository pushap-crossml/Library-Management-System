"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { booksAPI, reservationAPI } from "@/lib/api";
import toast from "react-hot-toast";

export default function BookDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const res = await booksAPI.getById(id);
      setBook(res.data);
    } catch {
      toast.error("Failed to load book details");
    }
  };

  const reserveBook = async () => {
    try {
      setLoading(true);
      await reservationAPI.reserveBook(id);
      toast.success("Book reserved successfully");
      router.push("/reservations");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.detail || "Reservation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!book) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 bg-white text-gray-900 min-h-screen border-2 border-sky-600 rounded-lg">
      <h1 className="text-2xl font-bold mb-2">{book.title}</h1>

      <p>
        <b>Author:</b>{" "}
        {book.authors?.map((a: any) => a.name).join(", ")}
      </p>

      <p><b>ISBN:</b> {book.isbn}</p>
      <p>
        <b>Available Copies:</b>{" "}
        <span
          className={
            book.available_copies > 0
              ? "text-green-600 font-semibold"
              : "text-red-600 font-semibold"
          }
        >
          {book.available_copies}
        </span>
      </p>

      <p className="mt-4"><b>Summary:</b></p>
      <p className="mt-1 leading-relaxed text-black">
        {book.description || "No summary available"}
      </p>

      {/* ✅ Reserve Button */}
      <div className="mt-6">
        <button
          disabled={book.available_copies === 0 || loading}
          onClick={reserveBook}
          className={`px-5 py-2 rounded text-white font-medium transition
            ${
              book.available_copies === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {loading ? "Reserving..." : "Reserve Book"}
        </button>
      </div>
    </div>
  );
}
