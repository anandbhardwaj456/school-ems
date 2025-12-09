import React, { useEffect, useState } from "react";
import api from "../api";

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchClasses = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/classes");
      setClasses(res.data?.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load classes from server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-800">Classes &amp; Sections</h2>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="px-4 py-2 border-b border-slate-200 flex items-center justify-between">
          <p className="text-sm font-medium text-slate-700">
            Classes
          </p>
          {loading && (
            <p className="text-xs text-slate-500">Loading classes...</p>
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
                  Display Name
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                  Academic Year
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {classes.length === 0 && !loading && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-sm text-slate-500"
                  >
                    No classes found.
                  </td>
                </tr>
              )}
              {classes.map((c) => (
                <tr key={c.classId} className="border-b border-slate-100">
                  <td className="px-4 py-2 text-xs text-slate-700">{c.name}</td>
                  <td className="px-4 py-2 text-xs text-slate-600">
                    {c.displayName || "-"}
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-600">
                    {c.academicYear || "-"}
                  </td>
                  <td className="px-4 py-2 text-xs">
                    <span className="inline-flex px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                      {c.status}
                    </span>
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
