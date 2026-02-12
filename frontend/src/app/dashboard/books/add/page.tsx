"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  booksAPI,
  authorsAPI,
  categoriesAPI,
  publishersAPI,
} from "@/lib/api";

interface Author {
  id: number;
  name: string;
}
interface Category {
  id: number;
  name: string;
}
interface Publisher {
  id: number;
  name: string;
}

export default function AddBookPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [publishers, setPublishers] = useState<Publisher[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    isbn: "",
    total_copies: 1,
    publication_year: "", // <-- user will enter this
    language: "en",
    description: "",
    authors: [] as string[], // User input (names)
    category: "",
    publisher: "",
  });

  // Load existing dropdown data
  useEffect(() => {
    fetchDropdownData();
  }, []);

  const normalizeData = (data: any) => {
    if (Array.isArray(data)) return data;
    if (data?.results && Array.isArray(data.results)) return data.results;
    return [];
  };

  const fetchDropdownData = async () => {
    try {
      const [a, c, p] = await Promise.all([
        authorsAPI.getAll(),
        categoriesAPI.getAll(),
        publishersAPI.getAll(),
      ]);
      setAuthors(normalizeData(a.data));
      setCategories(normalizeData(c.data));
      setPublishers(normalizeData(p.data));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dropdown data");
    }
  };

  // Form handlers
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "total_copies" || name === "publication_year"
          ? Number(value)
          : value,
    });
  };

  const addAuthor = (name: string) => {
    if (name && !formData.authors.includes(name)) {
      setFormData((prev) => ({ ...prev, authors: [...prev.authors, name] }));
    }
  };

  const removeAuthor = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      authors: prev.authors.filter((a) => a !== name),
    }));
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1️⃣ Map authors, category, publisher to IDs or create them
      const authorsIds: number[] = [];
      for (const name of formData.authors) {
        let author = authors.find((a) => a.name === name);
        if (!author) {
          const res = await authorsAPI.create({ name });
          author = res.data;
          setAuthors((prev) => [...prev, author]);
        }
        authorsIds.push(author.id);
      }

      // Category
      let categoryId: number | null = null;
      if (formData.category) {
        let cat = categories.find((c) => c.name === formData.category);
        if (!cat) {
          const res = await categoriesAPI.create({ name: formData.category });
          cat = res.data;
          setCategories((prev) => [...prev, cat]);
        }
        categoryId = cat.id;
      }

      // Publisher
      let publisherId: number | null = null;
      if (formData.publisher) {
        let pub = publishers.find((p) => p.name === formData.publisher);
        if (!pub) {
          const res = await publishersAPI.create({ name: formData.publisher });
          pub = res.data;
          setPublishers((prev) => [...prev, pub]);
        }
        publisherId = pub.id;
      }

      // 2️⃣ Prepare payload
      const payload = {
        title: formData.title,
        isbn: formData.isbn,
        total_copies: formData.total_copies,
        publication_year: formData.publication_year,
        language: formData.language,
        description: formData.description,
        authors: authorsIds,
        category: categoryId,
        publisher: publisherId,
      };

      console.log("Sending payload:", payload);

      // 3️⃣ Create book
      await booksAPI.create(payload);
      toast.success("Book added successfully 🎉");
      router.push("/dashboard/books");
    } catch (err: any) {
      console.error("Error adding book:", err);
      if (err.response?.data) {
        toast.error(JSON.stringify(err.response.data));
      } else {
        toast.error("Failed to add book");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 lg:pl-64 border-4 border-sky-400 rounded-xl m-2">
      <header className="bg-white shadow-sm border-b">
        <div className="h-16 flex items-center px-6">
          <h1 className="text-2xl font-bold text-black">Add New Book</h1>
        </div>
      </header>

      <main className="p-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-6 max-w-2xl space-y-4"
        >
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1 text-black">Title</label>
            <input
              type="text"
              name="title"
              required
              onChange={handleChange}
              className="w-full border border-black rounded-lg px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-100"
            />
          </div>

          {/* ISBN */}
          <div>
            <label className="block text-sm font-medium mb-1 text-black">ISBN</label>
            <input
              type="text"
              name="isbn"
              required
              onChange={handleChange}
              className="w-full border border-black rounded-lg px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-100"
            />
          </div>

          {/* Publication Year */}
          <div>
            <label className="block text-sm font-medium mb-1 text-black">Publication Year</label>
            <input
              type="number"
              name="publication_year"
              min={1000}
              max={2100}
              required
              value={formData.publication_year}
              onChange={handleChange}
              placeholder="Enter publication year"
              className="w-full border border-black rounded-lg px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-100"
            />
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-medium mb-1 text-black">Language</label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full border border-black rounded-lg px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-100"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1 text-black">Category</label>
            <input
              list="categories"
              name="category"
              placeholder="Select or type category"
              onChange={handleChange}
              className="w-full border border-black rounded-lg px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-100"
            />
            <datalist id="categories">
              {categories.map((c) => (
                <option key={c.id} value={c.name} />
              ))}
            </datalist>
          </div>

          {/* Publisher */}
          <div>
            <label className="block text-sm font-medium mb-1 text-black">Publisher</label>
            <input
              list="publishers"
              name="publisher"
              placeholder="Select or type publisher"
              onChange={handleChange}
              className="w-full border border-black rounded-lg px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-100"
            />
            <datalist id="publishers">
              {publishers.map((p) => (
                <option key={p.id} value={p.name} />
              ))}
            </datalist>
          </div>

          {/* Authors */}
          <div>
            <label className="block text-sm font-medium mb-1 text-black">Authors</label>
            <div className="flex gap-2 flex-wrap mb-2">
              {formData.authors.map((a) => (
                <span
                  key={a}
                  className="w-full border border-black rounded-lg px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-100"
                >
                  {a}
                  <button type="button" onClick={() => removeAuthor(a)}>
                    &times;
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Type author name and press Enter"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addAuthor(e.currentTarget.value);
                  e.currentTarget.value = "";
                }
              }}
              className="w-full border border-black rounded-lg px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-100"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1 text-black focus:ring">Description</label>
            <textarea
              name="description"
              onChange={handleChange}
              rows={4}
              className="w-full border border-black rounded-lg px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-100"
            />
          </div>

          {/* Total Copies */}
          <div>
            <label className="block text-sm font-medium mb-1 text-black">Total Copies</label>
            <input
              type="number"
              name="total_copies"
              min={1}
              required
              onChange={handleChange}
              className="w-full border border-black rounded-lg px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-300 text-black py-2 rounded-lg hover:bg-sky-300 transition"
          >
            {loading ? "Adding..." : "Add Book"}
          </button>
        </form>
      </main>
    </div>
  );
}
