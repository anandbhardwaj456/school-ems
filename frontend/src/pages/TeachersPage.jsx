import React, { useEffect, useState } from "react";
import api from "../api";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchTeachers = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (search) params.search = search;
      const res = await api.get("/teachers", { params });
      setTeachers(res.data?.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load teachers from server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchTeachers();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-800">Teachers</h2>

      <form
        onSubmit={handleSubmit}
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
            placeholder="e.g. Jane Smith"
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
          <p className="text-sm font-medium text-slate-700">Teacher List</p>
          {loading && (
            <p className="text-xs text-slate-500">Loading teachers...</p>
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
                  Employee Code
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                  Designation
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                  Department
                </th>
              </tr>
            </thead>
            <tbody>
              {teachers.length === 0 && !loading && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-sm text-slate-500"
                  >
                    No teachers found.
                  </td>
                </tr>
              )}
              {teachers.map((t) => (
                <tr key={t.teacherId} className="border-b border-slate-100">
                  <td className="px-4 py-2">{t.user?.fullName || "-"}</td>
                  <td className="px-4 py-2">{t.user?.email || "-"}</td>
                  <td className="px-4 py-2 text-xs text-slate-600">
                    {t.employeeCode || "-"}
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-600">
                    {t.designation || "-"}
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-600">
                    {t.department || "-"}
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
