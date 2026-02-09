'use client';

import { useEffect, useState } from 'react';
import { reservationAPI, booksAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [bookId, setBookId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchReservations();
    fetchBooks();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await reservationAPI.myReservations();
      setReservations(res.data.results || res.data);
    } catch (err: any) {
      console.error(err.response?.data);
      toast.error('Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const res = await booksAPI.getAll();
      setBooks(res.data.results || []);
    } catch (err: any) {
      console.error(err.response?.data);
      toast.error('Failed to load books');
    }
  };

  const handleSubmit = async () => {
    if (!bookId) {
      toast.error('Please select a book');
      return;
    }

    try {
      setSubmitting(true);
      await reservationAPI.reserveBook(Number(bookId));

      toast.success('Reservation added successfully');
      setBookId('');
      setShowForm(false);
      fetchReservations();
    } catch (err: any) {
      console.error(err.response?.data);
      toast.error(
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        'Reservation failed'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6 text-black">Loading...</div>;

  return (
    <div className="min-h-screen bg-white border-4 border-sky-400 p-6 rounded-lg text-black">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Reservations</h1>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-black rounded hover:bg-blue-700"
        >
          + Add Reservation
        </button>
      </div>

      {/* Add Reservation Form */}
      {showForm && (
        <div className="mb-6 border rounded-lg p-4 bg-gray-50">
          <h2 className="font-semibold mb-2">New Reservation</h2>

          <select
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            className="w-full border p-2 rounded mb-3 text-black"
          >
            <option value="">Select a book</option>

            {books.map((book) => (
              <option
                key={book.id}
                value={book.id}
                disabled={book.available_copies === 0}
              >
                {book.title} ({book.available_copies} available)
              </option>
            ))}
          </select>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 bg-green-600 text-black rounded hover:bg-green-700"
          >
            {submitting ? 'Submitting...' : 'Submit Reservation'}
          </button>
        </div>
      )}

      {/* Reservations List */}
      {reservations.length === 0 ? (
        <p className="text-gray-500">No reservations found</p>
      ) : (
        <table className="w-full border rounded text-black">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Book</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Reserved On</th>
            </tr>
          </thead>

          <tbody>
            {reservations.map((r) => (
              <tr key={r.id} className="border-b">
                <td className="p-2">{r.book_title}</td>
                <td className="p-2 capitalize">{r.status}</td>
                <td className="p-2">
                  {new Date(r.reservation_date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
