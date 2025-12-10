import React, { useEffect, useState } from "react";
import api from "../api";

export default function TimetablePage() {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");

  useEffect(() => {
    if (selectedClass) {
      fetchTimetable();
    }
  }, [selectedClass]);

  const fetchTimetable = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/timetable?classId=${selectedClass}`).catch(() => ({ data: { data: [] } }));
      setTimetable(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch timetable:", err);
    } finally {
      setLoading(false);
    }
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const periods = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Timetable</h2>
          <p className="text-sm text-slate-600">View class timetable</p>
        </div>
        <div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-md text-sm"
          >
            <option value="">Select Class</option>
          </select>
        </div>
      </div>

      {selectedClass ? (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Period</th>
                  {days.map((day) => (
                    <th key={day} className="px-4 py-3 text-center text-xs font-semibold text-slate-600">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {periods.map((period) => (
                  <tr key={period} className="border-b border-slate-100">
                    <td className="px-4 py-3 font-medium">{period}</td>
                    {days.map((day) => {
                      const slot = timetable.find(
                        (t) => t.day === day && t.period === period
                      );
                      return (
                        <td key={day} className="px-4 py-3 text-center">
                          {slot ? (
                            <div>
                              <p className="text-xs font-medium">{slot.subjectName}</p>
                              <p className="text-xs text-slate-500">{slot.teacherName}</p>
                            </div>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg p-8 text-center">
          <p className="text-slate-500">Please select a class to view timetable</p>
        </div>
      )}
    </div>
  );
}

