import React, { useEffect, useState } from "react";
import api from "../api";

export default function HomeworkPage() {
  const [homeworkList, setHomeworkList] = useState([]);
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [newHw, setNewHw] = useState({
    title: "",
    classId: "",
    sectionId: "",
    subjectId: "",
    dueDate: "",
  });

  const fetchHomework = async (opts = {}) => {
    const { classIdOverride, sectionIdOverride } = opts;
    setLoading(true);
    setError("");
    try {
      const params = {};
      const cId = classIdOverride ?? classId;
      const sId = sectionIdOverride ?? sectionId;
      if (cId) params.classId = cId;
      if (sId) params.sectionId = sId;
      const res = await api.get("/homework", { params });
      const payload = res.data;
      const list = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload)
        ? payload
        : [];
      setHomeworkList(list);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load homework from server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomework();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchHomework();
  };

   const handleCreateChange = (field, value) => {
    setNewHw((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    setCreateError("");
    try {
      const payload = {
        title: newHw.title,
        classId: newHw.classId || null,
        sectionId: newHw.sectionId || null,
        subjectId: newHw.subjectId || null,
        dueDate: newHw.dueDate || null,
      };
      await api.post("/homework", payload);
      setNewHw({ title: "", classId: "", sectionId: "", subjectId: "", dueDate: "" });
      fetchHomework({ classIdOverride: classId, sectionIdOverride: sectionId });
    } catch (err) {
      setCreateError(
        err.response?.data?.message || "Failed to create homework. Please try again."
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-800">Homework</h2>

      <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
        <p className="text-sm font-medium text-slate-700">Quick Create Homework</p>
        <p className="text-xs text-slate-500">
          Enter a title and optional class/section/subject and due date to quickly add
          homework.
        </p>

        {createError && (
          <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {createError}
          </div>
        )}

        <form
          onSubmit={handleCreateSubmit}
          className="flex flex-wrap gap-3 items-end text-sm"
        >
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Title
            </label>
            <input
              type="text"
              value={newHw.title}
              onChange={(e) => handleCreateChange("title", e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Homework title"
              required
            />
          </div>

          <div className="w-32">
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Class ID
            </label>
            <input
              type="text"
              value={newHw.classId}
              onChange={(e) => handleCreateChange("classId", e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="classId"
            />
          </div>

          <div className="w-32">
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Section ID
            </label>
            <input
              type="text"
              value={newHw.sectionId}
              onChange={(e) => handleCreateChange("sectionId", e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="sectionId"
            />
          </div>

          <div className="w-32">
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Subject ID
            </label>
            <input
              type="text"
              value={newHw.subjectId}
              onChange={(e) => handleCreateChange("subjectId", e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="subjectId"
            />
          </div>

          <div className="w-44">
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={newHw.dueDate}
              onChange={(e) => handleCreateChange("dueDate", e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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

      <form
        onSubmit={handleFilterSubmit}
        className="bg-white border border-slate-200 rounded-lg p-4 flex flex-wrap gap-3 items-end"
      >
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
          <p className="text-sm font-medium text-slate-700">Homework List</p>
          {loading && (
            <p className="text-xs text-slate-500">Loading homework...</p>
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
                  Class
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                  Section
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                  Subject
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                  Due Date
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                  Created By
                </th>
              </tr>
            </thead>
            <tbody>
              {homeworkList.length === 0 && !loading && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-sm text-slate-500"
                  >
                    No homework found.
                  </td>
                </tr>
              )}
              {homeworkList.map((hw) => (
                <tr key={hw.homeworkId || hw.id} className="border-b border-slate-100">
                  <td className="px-4 py-2">{hw.title}</td>
                  <td className="px-4 py-2 text-xs text-slate-600">
                    {hw.classId || "-"}
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-600">
                    {hw.sectionId || "-"}
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-600">
                    {hw.subjectId || "-"}
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-600">
                    {hw.dueDate
                      ? new Date(hw.dueDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-600">
                    {hw.teacherId || hw.createdBy || "-"}
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
