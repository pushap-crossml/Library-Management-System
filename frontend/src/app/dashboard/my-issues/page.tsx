"use client";

import { useEffect, useState } from "react";
import { issuesAPI } from "@/lib/api";
import toast from "react-hot-toast";

export default function MyIssuesPage() {
  const [issues, setIssues] = useState<any[]>([]);

  useEffect(() => {
    loadIssues();
  }, []);

  const loadIssues = async () => {
    try {
      const res = await issuesAPI.getMyIssues();
      setIssues(res.data);
    } catch {
      toast.error("Failed to load my issues");
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen border-2 border-sky-600 rounded-lg p-6 ">
      <h1 className="text-2xl font-bold mb-4 text-black">My Issued Books</h1>

      {issues.map((i) => (
        <div key={i.id} className="border p-4 mb-2 text-black">
          <p><b>Book:</b> {i.book_title}</p>
          <p><b>Due Date:</b> {i.due_date}</p>
          <p><b>Status:</b> {i.status}</p>
        </div>
      ))}
    </div>
  );
}
