import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const navLinkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-100 ${
      isActive ? "bg-slate-200 text-primary-700" : "text-slate-700"
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      {/* Top bar for mobile */}
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 md:hidden">
        <div>
          <h1 className="text-base font-semibold text-primary-700">SmartSkul EMS</h1>
          <p className="text-[11px] text-slate-500">Admin Panel</p>
        </div>
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="inline-flex items-center justify-center p-2 rounded-md border border-slate-300 text-slate-700 bg-white"
        >
          <span className="sr-only">Open navigation</span>
          ☰
        </button>
      </header>

      <div className="flex flex-1">
        {/* Sidebar for desktop */}
        <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col">
          <div className="px-4 py-4 border-b border-slate-200">
            <h1 className="text-lg font-semibold text-primary-700">SmartSkul EMS</h1>
            <p className="text-xs text-slate-500">Admin Panel</p>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
          <NavLink to="/" end className={navLinkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/students" className={navLinkClass}>
            Students
          </NavLink>
          <NavLink to="/teachers" className={navLinkClass}>
            Teachers
          </NavLink>
          <NavLink to="/classes" className={navLinkClass}>
            Classes & Sections
          </NavLink>
          <NavLink to="/fees" className={navLinkClass}>
            Fees
          </NavLink>
          <NavLink to="/homework" className={navLinkClass}>
            Homework
          </NavLink>
          <NavLink to="/announcements" className={navLinkClass}>
            Announcements
          </NavLink>
          <NavLink to="/library" className={navLinkClass}>
            Library
          </NavLink>
          <NavLink to="/transport" className={navLinkClass}>
            Transport
          </NavLink>
          <NavLink to="/messages" className={navLinkClass}>
            Messages
          </NavLink>
          </nav>
          <div className="p-4 border-t border-slate-200">
            <button
              onClick={handleLogout}
              className="w-full inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* Overlay sidebar for mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 flex md:hidden">
            <div
              className="fixed inset-0 bg-black/30"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="relative z-50 w-64 bg-white border-r border-slate-200 flex flex-col">
              <div className="px-4 py-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h1 className="text-lg font-semibold text-primary-700">SmartSkul EMS</h1>
                  <p className="text-xs text-slate-500">Admin Panel</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="inline-flex items-center justify-center p-1 rounded-md text-slate-600 hover:bg-slate-100"
                >
                  ✕
                </button>
              </div>
              <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
                <NavLink
                  to="/"
                  end
                  className={navLinkClass}
                  onClick={() => setSidebarOpen(false)}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/students"
                  className={navLinkClass}
                  onClick={() => setSidebarOpen(false)}
                >
                  Students
                </NavLink>
                <NavLink
                  to="/teachers"
                  className={navLinkClass}
                  onClick={() => setSidebarOpen(false)}
                >
                  Teachers
                </NavLink>
                <NavLink
                  to="/classes"
                  className={navLinkClass}
                  onClick={() => setSidebarOpen(false)}
                >
                  Classes & Sections
                </NavLink>
                <NavLink
                  to="/fees"
                  className={navLinkClass}
                  onClick={() => setSidebarOpen(false)}
                >
                  Fees
                </NavLink>
                <NavLink
                  to="/homework"
                  className={navLinkClass}
                  onClick={() => setSidebarOpen(false)}
                >
                  Homework
                </NavLink>
                <NavLink
                  to="/announcements"
                  className={navLinkClass}
                  onClick={() => setSidebarOpen(false)}
                >
                  Announcements
                </NavLink>
                <NavLink
                  to="/library"
                  className={navLinkClass}
                  onClick={() => setSidebarOpen(false)}
                >
                  Library
                </NavLink>
                <NavLink
                  to="/transport"
                  className={navLinkClass}
                  onClick={() => setSidebarOpen(false)}
                >
                  Transport
                </NavLink>
                <NavLink
                  to="/messages"
                  className={navLinkClass}
                  onClick={() => setSidebarOpen(false)}
                >
                  Messages
                </NavLink>
              </nav>
              <div className="p-4 border-t border-slate-200">
                <button
                  onClick={() => {
                    setSidebarOpen(false);
                    handleLogout();
                  }}
                  className="w-full inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md"
                >
                  Logout
                </button>
              </div>
            </aside>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
