import React from "react";

export default function DashboardHome() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-800">Dashboard</h2>
      <p className="text-sm text-slate-600">
        Welcome to SmartSkul EMS. Use the sidebar to navigate between modules such
        as Students, Teachers, Classes, Fees, and more.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <p className="text-xs uppercase text-slate-400 mb-1">Students</p>
          <p className="text-2xl font-semibold text-slate-800">—</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <p className="text-xs uppercase text-slate-400 mb-1">Teachers</p>
          <p className="text-2xl font-semibold text-slate-800">—</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <p className="text-xs uppercase text-slate-400 mb-1">Classes</p>
          <p className="text-2xl font-semibold text-slate-800">—</p>
        </div>
      </div>
    </div>
  );
}
