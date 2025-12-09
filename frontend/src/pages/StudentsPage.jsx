import React, { useEffect, useState } from "react";
import api from "../api";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchStudents = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        page,
        limit: 10,
      };
      if (search) params.search = search;
      if (classId) params.classId = classId;
      if (sectionId) params.sectionId = sectionId;

      const res = await api.get("/students", { params });
      setStudents(res.data?.data || []);
      setTotalPages(res.data?.pagination?.totalPages || 1);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load students from server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchStudents();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-800">Students</h2>

      <form
        onSubmit={handleFilterSubmit}
        className="bg-white border border-slate-200 rounded-lg p-4 flex flex-wrap gap-3 items-end"
      >
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Search (name or email)
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="e.g. John Doe"
          />
        </div>

        <div className="w-40">
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Class ID
          </label>
          <input
            type="text"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="classId"
          />
        </div>

        <div className="w-40">
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Section ID
          </label>
          <input
            type="text"
            value={sectionId}
            onChange={(e) => setSectionId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="sectionId"
          />
        </div>

        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
        >
          Apply
        </button>
      </form>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="px-4 py-2 border-b border-slate-200 flex items-center justify-between">
          <p className="text-sm font-medium text-slate-700">Student List</p>
          {loading && (
            <p className="text-xs text-slate-500">Loading students...</p>
          )}
        </div>

        {error && (
          <div className="px-4 py-2 text-sm text-red-600 bg-red-50 border-b border-red-200">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                  Name
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                  Email
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                  Class
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                  Section
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                  Admission No
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 && !loading && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-sm text-slate-500"
                  >
                    No students found.
                  </td>
                </tr>
              )}
              {students.map((s) => (
                <tr key={s.studentId} className="border-b border-slate-100">
                  <td className="px-4 py-2">
                    {s.user?.fullName || "-"}
                  </td>
                  <td className="px-4 py-2">
                    {s.user?.email || "-"}
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-600">
                    {s.classId || "-"}
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-600">
                    {s.sectionId || "-"}
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-600">
                    {s.admissionNo || "-"}
                  </td>
                  <td className="px-4 py-2 text-xs">
                    <span className="inline-flex px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="space-x-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-2 py-1 border border-slate-300 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-2 py-1 border border-slate-300 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
