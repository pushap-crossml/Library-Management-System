"use client";

import { useEffect, useState } from "react";
import { issuesAPI } from "@/lib/api";
import toast from "react-hot-toast";

export default function ReturnPage() {
  const [issues, setIssues] = useState<any[]>([]);

  useEffect(() => {
    fetchMyIssues();
  }, []);

  const fetchMyIssues = async () => {
    try {
      const res = await issuesAPI.getMyIssues();
      setIssues(res.data);
    } catch {
      toast.error("Failed to load issues");
    }
  };

  const returnBook = async (id: number) => {
    try {
      await issuesAPI.returnBook(id);
      toast.success("Book returned");
      fetchMyIssues();
    } catch {
      toast.error("Return failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Return Book</h1>

      {issues.map((issue) => (
        <div
          key={issue.id}
          className="border p-4 mb-2 flex justify-between"
        >
          <span>{issue.book_title}</span>
          <button
            onClick={() => returnBook(issue.id)}
            className="bg-red-600 text-white px-3 py-1 rounded"
          >
            Return
          </button>
        </div>
      ))}
    </div>
  );
}
