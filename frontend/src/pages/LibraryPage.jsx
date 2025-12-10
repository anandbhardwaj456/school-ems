import React, { useEffect, useState } from "react";
import api from "../api";

export default function LibraryPage() {
  const [books, setBooks] = useState([]);
  const [booksLoading, setBooksLoading] = useState(false);
  const [booksError, setBooksError] = useState("");

  const [creatingBook, setCreatingBook] = useState(false);
  const [createBookError, setCreateBookError] = useState("");
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    totalCopies: "",
  });

  const [userId, setUserId] = useState("");
  const [issues, setIssues] = useState([]);
  const [issuesLoading, setIssuesLoading] = useState(false);
  const [issuesError, setIssuesError] = useState("");

  const fetchBooks = async () => {
    setBooksLoading(true);
    setBooksError("");
    try {
      const res = await api.get("/library/books");
      const payload = res.data;
      const list = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload)
        ? payload
        : [];
      setBooks(list);
    } catch (err) {
      setBooksError(
        err.response?.data?.message || "Failed to load books from server."
      );
    } finally {
      setBooksLoading(false);
    }
  };

  const handleBookFieldChange = (field, value) => {
    setNewBook((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateBook = async (e) => {
    e.preventDefault();
    setCreatingBook(true);
    setCreateBookError("");
    try {
      const payload = {
        title: newBook.title,
        author: newBook.author || null,
        isbn: newBook.isbn || null,
        category: newBook.category || null,
        totalCopies: newBook.totalCopies ? Number(newBook.totalCopies) : null,
      };
      await api.post("/library/books", payload);
      setNewBook({ title: "", author: "", isbn: "", category: "", totalCopies: "" });
      fetchBooks();
    } catch (err) {
      setCreateBookError(
        err.response?.data?.message || "Failed to create book. Please try again."
      );
    } finally {
      setCreatingBook(false);
    }
  };

  const fetchIssuesForUser = async (e) => {
    if (e) e.preventDefault();
    if (!userId) {
      setIssues([]);
      setIssuesError("");
      return;
    }
    setIssuesLoading(true);
    setIssuesError("");
    try {
      const res = await api.get(`/library/users/${userId}/issues`);
      setIssues(res.data || []);
    } catch (err) {
      setIssuesError(
        err.response?.data?.message ||
          "Failed to load issued books for the specified user."
      );
    } finally {
      setIssuesLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const formatDate = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-800">Library</h2>
      <p className="text-sm text-slate-600">
        Browse library books and quickly check which books are issued to a user.
      </p>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="px-4 py-2 border-b border-slate-200 flex items-center justify-between">
          <p className="text-sm font-medium text-slate-700">Books</p>
          {booksLoading && (
            <p className="text-xs text-slate-500">Loading books...</p>
          )}
        </div>

        <div className="px-4 py-3 border-b border-slate-200 space-y-3 text-sm">
          <p className="text-xs font-medium text-slate-700">Quick Create Book</p>
          {createBookError && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
              {createBookError}
            </div>
          )}
          <form
            onSubmit={handleCreateBook}
            className="flex flex-wrap gap-3 items-end"
          >
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Title
              </label>
              <input
                type="text"
                value={newBook.title}
                onChange={(e) => handleBookFieldChange("title", e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Book title"
                required
              />
            </div>

            <div className="w-40">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Author
              </label>
              <input
                type="text"
                value={newBook.author}
                onChange={(e) => handleBookFieldChange("author", e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Author"
              />
            </div>

            <div className="w-40">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                ISBN
              </label>
              <input
                type="text"
                value={newBook.isbn}
                onChange={(e) => handleBookFieldChange("isbn", e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="ISBN"
              />
            </div>

            <div className="w-32">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Category
              </label>
              <input
                type="text"
                value={newBook.category}
                onChange={(e) => handleBookFieldChange("category", e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Category"
              />
            </div>

            <div className="w-32">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Total Copies
              </label>
              <input
                type="number"
                min="0"
                value={newBook.totalCopies}
                onChange={(e) => handleBookFieldChange("totalCopies", e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g. 10"
              />
            </div>

            <button
              type="submit"
              disabled={creatingBook}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md disabled:opacity-50"
            >
              {creatingBook ? "Saving..." : "Create"}
            </button>
          </form>
        </div>

        {booksError && (
          <div className="px-4 py-2 text-sm text-red-600 bg-red-50 border-b border-red-200">
            {booksError}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                  Title
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                  Author
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                  ISBN
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                  Category
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                  Total Copies
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                  Available Copies
                </th>
              </tr>
            </thead>
            <tbody>
              {books.length === 0 && !booksLoading && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-sm text-slate-500"
                  >
                    No books found.
                  </td>
                </tr>
              )}
              {books.map((b) => (
                <tr key={b.bookId || b.id} className="border-b border-slate-100">
                  <td className="px-4 py-2">{b.title}</td>
                  <td className="px-4 py-2 text-xs text-slate-600">
                    {b.author || "-"}
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-600">
                    {b.isbn || "-"}
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-600">
                    {b.category || "-"}
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-600">
                    {b.totalCopies != null ? b.totalCopies : "-"}
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-600">
                    {b.availableCopies != null ? b.availableCopies : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-700">Issued Books by User</p>
            <p className="text-xs text-slate-500">
              Enter a user ID (student/teacher) to view currently and previously issued
              books.
            </p>
          </div>

          <form
            onSubmit={fetchIssuesForUser}
            className="flex flex-wrap items-end gap-2"
          >
            <div className="w-40">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                User ID
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="userId"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
            >
              Lookup
            </button>
          </form>
        </div>

        {issuesLoading && (
          <div className="px-4 py-2 text-xs text-slate-500 border-b border-slate-200">
            Loading issued books...
          </div>
        )}

        {issuesError && (
          <div className="px-4 py-2 text-sm text-red-600 bg-red-50 border-b border-red-200">
            {issuesError}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                  Book ID
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                  Issued On
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                  Due On
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                  Returned On
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                  Fine Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {issues.length === 0 && !issuesLoading && userId && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-sm text-slate-500"
                  >
                    No issued books found for this user.
                  </td>
                </tr>
              )}
              {issues.map((i) => (
                <tr key={i.issueId || i.id} className="border-b border-slate-100">
                  <td className="px-4 py-2">{i.bookId || "-"}</td>
                  <td className="px-4 py-2 text-xs text-slate-600">
                    {formatDate(i.issuedOn)}
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-600">
                    {formatDate(i.dueOn)}
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-600">
                    {formatDate(i.returnedOn)}
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-600">
                    {i.fineAmount != null ? `₹${i.fineAmount}` : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
