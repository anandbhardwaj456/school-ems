import React, { useEffect, useState } from "react";
import api from "../api";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    message: "",
    targetType: "ALL",
  });

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/announcements");
      setAnnouncements(res.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load announcements from server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const trimMessage = (msg) => {
    if (!msg) return "-";
    return msg.length > 80 ? msg.slice(0, 77) + "..." : msg;
  };

  const formatDateTime = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleString();
  };

  const formatTarget = (a) => {
    if (!a) return "-";
    if (a.targetType === "ALL") return "All Users";
    if (a.targetType === "ROLE") return a.role || "Role";
    if (a.targetType === "CLASS")
      return `Class ${a.classId || "-"}${a.sectionId ? " / Section " + a.sectionId : ""}`;
    if (a.targetType === "STUDENT") return `Student ${a.studentId || "-"}`;
    return a.targetType || "-";
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-800">Announcements</h2>
      <p className="text-sm text-slate-600">
        View and create announcements for roles, classes, sections, or specific
        students.
      </p>

      <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
        <p className="text-sm font-medium text-slate-700">Quick Create Announcement</p>
        <p className="text-xs text-slate-500">
          Enter a title and message, and optionally adjust the target type.
        </p>

        {createError && (
          <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {createError}
          </div>
        )}

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setCreating(true);
            setCreateError("");
            try {
              await api.post("/announcements", newAnnouncement);
              setNewAnnouncement({ title: "", message: "", targetType: "ALL" });
              fetchAnnouncements();
            } catch (err) {
              setCreateError(
                err.response?.data?.message ||
                  "Failed to create announcement. Please try again."
              );
            } finally {
              setCreating(false);
            }
          }}
          className="space-y-3 text-sm"
        >
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Title
              </label>
              <input
                type="text"
                value={newAnnouncement.title}
                onChange={(e) =>
                  setNewAnnouncement((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Announcement title"
                required
              />
            </div>

            <div className="w-40">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Target Type
              </label>
              <select
                value={newAnnouncement.targetType}
                onChange={(e) =>
                  setNewAnnouncement((prev) => ({
                    ...prev,
                    targetType: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
              >
                <option value="ALL">All</option>
                <option value="ROLE">Role</option>
                <option value="CLASS">Class</option>
                <option value="STUDENT">Student</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Message
            </label>
            <textarea
              rows={3}
              value={newAnnouncement.message}
              onChange={(e) =>
                setNewAnnouncement((prev) => ({ ...prev, message: e.target.value }))
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Write the announcement message"
              required
            />
          </div>

          <button
            type="submit"
            disabled={creating}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md disabled:opacity-50"
          >
            {creating ? "Saving..." : "Create"}
          </button>
        </form>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="px-4 py-2 border-b border-slate-200 flex items-center justify-between">
          <p className="text-sm font-medium text-slate-700">Announcements List</p>
          {loading && (
            <p className="text-xs text-slate-500">Loading announcements...</p>
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
                  Title
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                  Message
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                  Target
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                  Valid From
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                  Valid To
                </th>
              </tr>
            </thead>
            <tbody>
              {announcements.length === 0 && !loading && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-sm text-slate-500"
                  >
                    No announcements found.
                  </td>
                </tr>
              )}
              {announcements.map((a) => (
                <tr key={a.announcementId || a.id} className="border-b border-slate-100">
                  <td className="px-4 py-2">{a.title}</td>
                  <td className="px-4 py-2 text-xs text-slate-600">
                    {trimMessage(a.message)}
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-600">
                    {formatTarget(a)}
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-600">
                    {formatDateTime(a.validFrom)}
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-600">
                    {formatDateTime(a.validTo)}
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
