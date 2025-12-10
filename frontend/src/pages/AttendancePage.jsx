import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../api";
import Table from "../components/Table";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import { useToast } from "../components/ToastProvider";

export default function AttendancePage() {
  const { isAdmin, isTeacher } = useAuth();
  const { showToast } = useToast();
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedClass, setSelectedClass] = useState("");
  const [classes, setClasses] = useState([]);
  const [viewMode, setViewMode] = useState("mark"); // 'mark' or 'report'

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass && selectedDate) {
      fetchStudentsForAttendance();
    }
  }, [selectedClass, selectedDate]);

  const fetchClasses = async () => {
    try {
      const res = await api.get("/classes").catch(() => ({ data: { data: [] } }));
      setClasses(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch classes:", err);
    }
  };

  const fetchStudentsForAttendance = async () => {
    setLoading(true);
    try {
      // Fetch students for the selected class
      const res = await api.get(`/students?classId=${selectedClass}`).catch(() => ({ data: { data: [] } }));
      const studentsList = res.data?.data || [];
      setStudents(studentsList);

      // Fetch existing attendance for the date
      const attendanceRes = await api
        .get(`/attendance?classId=${selectedClass}&date=${selectedDate}`)
        .catch(() => ({ data: { data: [] } }));
      
      const attendanceData = {};
      (attendanceRes.data?.data || []).forEach((record) => {
        attendanceData[record.studentId] = record.status;
      });
      setAttendance(attendanceData);
    } catch (err) {
      showToast("Failed to load students", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance({ ...attendance, [studentId]: status });
  };

  const handleSaveAttendance = async () => {
    if (!selectedClass || !selectedDate) {
      showToast("Please select class and date", "warning");
      return;
    }

    setSaving(true);
    try {
      const records = Object.entries(attendance).map(([studentId, status]) => ({
        studentId,
        classId: selectedClass,
        date: selectedDate,
        status,
      }));

      await api.post("/attendance", { records });
      showToast("Attendance saved successfully", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to save attendance", "error");
    } finally {
      setSaving(false);
    }
  };

  const markAll = (status) => {
    const newAttendance = {};
    students.forEach((student) => {
      newAttendance[student.studentId] = status;
    });
    setAttendance(newAttendance);
  };

  const columns = [
    {
      header: "Admission No",
      accessor: "admissionNo",
    },
    {
      header: "Name",
      accessor: "user",
      render: (row) => row.user?.fullName || "-",
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleAttendanceChange(row.studentId, "PRESENT")}
            className={`px-3 py-1 text-xs font-medium rounded ${
              attendance[row.studentId] === "PRESENT"
                ? "bg-green-100 text-green-800 border-2 border-green-600"
                : "bg-slate-100 text-slate-700 hover:bg-green-50"
            }`}
          >
            Present
          </button>
          <button
            onClick={() => handleAttendanceChange(row.studentId, "ABSENT")}
            className={`px-3 py-1 text-xs font-medium rounded ${
              attendance[row.studentId] === "ABSENT"
                ? "bg-red-100 text-red-800 border-2 border-red-600"
                : "bg-slate-100 text-slate-700 hover:bg-red-50"
            }`}
          >
            Absent
          </button>
          <button
            onClick={() => handleAttendanceChange(row.studentId, "LATE")}
            className={`px-3 py-1 text-xs font-medium rounded ${
              attendance[row.studentId] === "LATE"
                ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-600"
                : "bg-slate-100 text-slate-700 hover:bg-yellow-50"
            }`}
          >
            Late
          </button>
        </div>
      ),
    },
  ];

  if (isTeacher || isAdmin) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Attendance</h2>
            <p className="text-sm text-slate-600 mt-1">Mark and manage student attendance</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "mark" ? "primary" : "secondary"}
              onClick={() => setViewMode("mark")}
            >
              Mark Attendance
            </Button>
            <Button
              variant={viewMode === "report" ? "primary" : "secondary"}
              onClick={() => setViewMode("report")}
            >
              View Reports
            </Button>
          </div>
        </div>

        {viewMode === "mark" && (
          <>
            {/* Filters */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Select Class</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select Class</option>
                    {classes.map((cls) => (
                      <option key={cls.classId} value={cls.classId}>
                        {cls.className || cls.classId}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <FormInput
                    label="Date"
                    name="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={fetchStudentsForAttendance} className="w-full">
                    Load Students
                  </Button>
                </div>
              </div>
            </div>

            {/* Attendance Marking */}
            {selectedClass && students.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-800">
                    Mark Attendance ({students.length} students)
                  </h3>
                  <div className="flex gap-2">
                    <Button variant="success" size="sm" onClick={() => markAll("PRESENT")}>
                      Mark All Present
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => markAll("ABSENT")}>
                      Mark All Absent
                    </Button>
                  </div>
                </div>

                <Table
                  columns={columns}
                  data={students}
                  loading={loading}
                  emptyMessage="No students found for this class"
                />

                <div className="mt-6 flex justify-end gap-2">
                  <Button variant="secondary" onClick={() => setAttendance({})}>
                    Reset
                  </Button>
                  <Button onClick={handleSaveAttendance} loading={saving}>
                    Save Attendance
                  </Button>
                </div>

                {/* Summary */}
                <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {Object.values(attendance).filter((s) => s === "PRESENT").length}
                    </p>
                    <p className="text-sm text-slate-600">Present</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">
                      {Object.values(attendance).filter((s) => s === "ABSENT").length}
                    </p>
                    <p className="text-sm text-slate-600">Absent</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">
                      {Object.values(attendance).filter((s) => s === "LATE").length}
                    </p>
                    <p className="text-sm text-slate-600">Late</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {viewMode === "report" && (
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Attendance Reports</h3>
            <p className="text-slate-600">Attendance reports and analytics will appear here</p>
          </div>
        )}
      </div>
    );
  }

  // Student/Parent view
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">My Attendance</h2>
        <p className="text-sm text-slate-600 mt-1">View your attendance records</p>
      </div>
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <p className="text-slate-600">Attendance records will appear here</p>
      </div>
    </div>
  );
}
