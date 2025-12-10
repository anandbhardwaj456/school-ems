import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/Button";

export default function ReportsPage() {
  const { isAdmin, isTeacher } = useAuth();
  const [selectedReport, setSelectedReport] = useState("");

  const adminReports = [
    { id: "student", name: "Student Report", description: "Complete student information and statistics" },
    { id: "attendance", name: "Attendance Report", description: "Daily, monthly, and yearly attendance analytics" },
    { id: "exam", name: "Exam Report", description: "Exam results and performance analysis" },
    { id: "fee", name: "Fee Report", description: "Fee collection and pending reports" },
    { id: "teacher", name: "Teacher Report", description: "Teacher performance and class assignments" },
  ];

  const teacherReports = [
    { id: "class", name: "Class Report", description: "Class-wise student performance" },
    { id: "attendance", name: "Attendance Report", description: "Attendance records for your classes" },
    { id: "exam", name: "Exam Report", description: "Exam results for your subjects" },
  ];

  const reports = isAdmin ? adminReports : teacherReports;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Reports</h2>
        <p className="text-sm text-slate-600 mt-1">Generate and view various reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedReport(report.id)}
          >
            <h3 className="text-lg font-semibold text-slate-800 mb-2">{report.name}</h3>
            <p className="text-sm text-slate-600 mb-4">{report.description}</p>
            <Button variant="outline" size="sm" className="w-full">
              Generate Report
            </Button>
          </div>
        ))}
      </div>

      {selectedReport && (
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            {reports.find((r) => r.id === selectedReport)?.name}
          </h3>
          <p className="text-slate-600">Report generation interface will appear here</p>
        </div>
      )}
    </div>
  );
}

