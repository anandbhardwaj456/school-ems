import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const role = user?.role || "";

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? "bg-primary-50 text-primary-700 border-l-4 border-primary-600"
        : "text-slate-700 hover:bg-slate-100"
    }`;

  // Complete menu items with role-based access
  const getMenuItems = () => {
    const allItems = [
      { path: "/", label: "Dashboard", icon: "📊", roles: ["admin", "teacher", "student", "parent"] },
      
      // Admin & Teacher only
      { path: "/students", label: "Students", icon: "🎓", roles: ["admin", "teacher"] },
      { path: "/teachers", label: "Teachers", icon: "👨‍🏫", roles: ["admin"] },
      { path: "/parents", label: "Parents", icon: "👨‍👩‍👧", roles: ["admin"] },
      
      // Class & Section Management
      { path: "/classes", label: "Classes", icon: "🏫", roles: ["admin", "teacher"] },
      { path: "/sections", label: "Sections", icon: "📋", roles: ["admin"] },
      { path: "/subjects", label: "Subjects", icon: "📚", roles: ["admin", "teacher"] },
      
      // Attendance
      { path: "/attendance", label: "Attendance", icon: "✅", roles: ["admin", "teacher", "student", "parent"] },
      
      // Exams & Marks
      { path: "/exams", label: "Exams & Marks", icon: "📝", roles: ["admin", "teacher", "student", "parent"] },
      
      // Timetable
      { path: "/timetable", label: "Timetable", icon: "📅", roles: ["admin", "teacher", "student", "parent"] },
      
      // Homework
      { path: "/homework", label: "Homework", icon: "📋", roles: ["admin", "teacher", "student", "parent"] },
      
      // Fees
      { path: "/fees", label: "Fees", icon: "💰", roles: ["admin", "parent", "student"] },
      
      // Announcements
      { path: "/announcements", label: "Announcements", icon: "📢", roles: ["admin", "teacher", "student", "parent"] },
      
      // Events
      { path: "/events", label: "Events", icon: "🎉", roles: ["admin", "teacher", "student", "parent"] },
      
      // Reports
      { path: "/reports", label: "Reports", icon: "📈", roles: ["admin", "teacher"] },
      
      // Communication
      { path: "/messages", label: "Messages", icon: "💬", roles: ["admin", "teacher", "student", "parent"] },
      
      // Library
      { path: "/library", label: "Library", icon: "📖", roles: ["admin", "teacher", "student"] },
      
      // Transport
      { path: "/transport", label: "Transport", icon: "🚌", roles: ["admin", "parent"] },
      
      // Inventory
      { path: "/inventory", label: "Inventory", icon: "📦", roles: ["admin"] },
      
      // Hostel
      { path: "/hostel", label: "Hostel", icon: "🏠", roles: ["admin"] },
      
      // Payroll
      { path: "/payroll", label: "Payroll", icon: "💵", roles: ["admin"] },
      
      // Profile
      { path: "/profile", label: "Profile", icon: "👤", roles: ["admin", "teacher", "student", "parent"] },
      
      // Settings
      { path: "/settings", label: "Settings", icon: "⚙️", roles: ["admin"] },
    ];

    return allItems.filter((item) => item.roles.includes(role));
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 md:z-auto w-64 bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="px-4 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-primary-700">SmartSkul EMS</h1>
            <p className="text-xs text-slate-500 capitalize">{role} Panel</p>
          </div>
          <button
            onClick={onClose}
            className="md:hidden inline-flex items-center justify-center p-1 rounded-md text-slate-600 hover:bg-slate-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={navLinkClass}
              onClick={onClose}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200">
          <div className="px-3 py-2 text-xs text-slate-500 mb-2">
            Logged in as <span className="font-medium capitalize">{role}</span>
          </div>
          <button
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
            }}
            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
