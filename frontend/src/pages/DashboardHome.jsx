import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function DashboardHome() {
  const { user, isAdmin, isTeacher, isStudent, isParent } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    classes: 0,
    feesCollected: 0,
    feesPending: 0,
    attendanceToday: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentAdmissions, setRecentAdmissions] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch stats based on role
      if (isAdmin) {
        // Admin dashboard stats
        // Note: These API calls would need to be implemented in backend
        // For now, showing placeholder structure
        const [studentsRes, teachersRes, classesRes, announcementsRes] = await Promise.allSettled([
          api.get("/students").catch(() => ({ data: { data: [] } })),
          api.get("/teachers").catch(() => ({ data: { data: [] } })),
          api.get("/classes").catch(() => ({ data: { data: [] } })),
          api.get("/announcements").catch(() => ({ data: { data: [] } })),
        ]);

        const students = studentsRes.status === "fulfilled" ? studentsRes.value.data?.data || [] : [];
        const teachers = teachersRes.status === "fulfilled" ? teachersRes.value.data?.data || [] : [];
        const classes = classesRes.status === "fulfilled" ? classesRes.value.data?.data || [] : [];
        const anns = announcementsRes.status === "fulfilled" ? announcementsRes.value.data?.data || [] : [];

        setStats({
          students: students.length,
          teachers: teachers.length,
          classes: classes.length,
          feesCollected: 0, // Would need fees API
          feesPending: 0,
          attendanceToday: 0,
        });
        setAnnouncements(anns.slice(0, 5));
      } else if (isTeacher) {
        // Teacher dashboard
        const [classesRes, announcementsRes] = await Promise.allSettled([
          api.get("/classes").catch(() => ({ data: { data: [] } })),
          api.get("/announcements").catch(() => ({ data: { data: [] } })),
        ]);

        const classes = classesRes.status === "fulfilled" ? classesRes.value.data?.data || [] : [];
        const anns = announcementsRes.status === "fulfilled" ? announcementsRes.value.data?.data || [] : [];

        setStats({
          students: 0,
          teachers: 0,
          classes: classes.length,
          feesCollected: 0,
          feesPending: 0,
          attendanceToday: 0,
        });
        setAnnouncements(anns.slice(0, 5));
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  // Admin Dashboard
  if (isAdmin) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Admin Dashboard</h2>
          <p className="text-sm text-slate-600 mt-1">Welcome back, {user?.fullName}</p>
        </div>

        {/* Stats Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Students"
            value={stats.students}
            icon="🎓"
            color="blue"
            onClick={() => navigate("/students")}
          />
          <StatCard
            title="Teachers"
            value={stats.teachers}
            icon="👨‍🏫"
            color="green"
            onClick={() => navigate("/teachers")}
          />
          <StatCard
            title="Classes"
            value={stats.classes}
            icon="🏫"
            color="purple"
            onClick={() => navigate("/classes")}
          />
          <StatCard
            title="Fees Collected"
            value={`₹${stats.feesCollected.toLocaleString()}`}
            icon="💰"
            color="emerald"
            onClick={() => navigate("/fees")}
          />
          <StatCard
            title="Fees Pending"
            value={`₹${stats.feesPending.toLocaleString()}`}
            icon="⏳"
            color="orange"
            onClick={() => navigate("/fees")}
          />
          <StatCard
            title="Attendance Today"
            value={`${stats.attendanceToday}%`}
            icon="✅"
            color="indigo"
            onClick={() => navigate("/attendance")}
          />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Admissions */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Admissions</h3>
            {recentAdmissions.length === 0 ? (
              <p className="text-sm text-slate-500">No recent admissions</p>
            ) : (
              <div className="space-y-3">
                {recentAdmissions.map((admission) => (
                  <div key={admission.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{admission.name}</p>
                      <p className="text-xs text-slate-500">{admission.class}</p>
                    </div>
                    <span className="text-xs text-slate-500">{admission.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Announcements */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Announcements</h3>
            {announcements.length === 0 ? (
              <p className="text-sm text-slate-500">No announcements</p>
            ) : (
              <div className="space-y-3">
                {announcements.map((ann) => (
                  <div key={ann.announcementId || ann.id} className="p-3 bg-slate-50 rounded-md">
                    <p className="text-sm font-medium text-slate-800">{ann.title}</p>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{ann.message}</p>
                    <p className="text-xs text-slate-500 mt-2">
                      {new Date(ann.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Teacher Dashboard
  if (isTeacher) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Teacher Dashboard</h2>
          <p className="text-sm text-slate-600 mt-1">Welcome, {user?.fullName}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="My Classes"
            value={stats.classes}
            icon="🏫"
            color="blue"
            onClick={() => navigate("/classes")}
          />
          <StatCard
            title="Today's Timetable"
            value="View"
            icon="📅"
            color="green"
            onClick={() => navigate("/timetable")}
          />
          <StatCard
            title="Homework Due"
            value="Check"
            icon="📋"
            color="purple"
            onClick={() => navigate("/homework")}
          />
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Announcements</h3>
          {announcements.length === 0 ? (
            <p className="text-sm text-slate-500">No announcements</p>
          ) : (
            <div className="space-y-3">
              {announcements.map((ann) => (
                <div key={ann.announcementId || ann.id} className="p-3 bg-slate-50 rounded-md">
                  <p className="text-sm font-medium text-slate-800">{ann.title}</p>
                  <p className="text-xs text-slate-600 mt-1">{ann.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Student/Parent Dashboard (simplified)
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-sm text-slate-600 mt-1">Welcome, {user?.fullName}</p>
      </div>
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <p className="text-slate-600">Dashboard content for {user?.role}</p>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, onClick }) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-200",
  };

  return (
    <button
      onClick={onClick}
      className={`bg-white rounded-lg border border-slate-200 p-6 text-left hover:shadow-md transition-shadow ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <span className="text-xl">{icon}</span>
        </div>
      </div>
      <p className="text-xs uppercase text-slate-500 mb-1">{title}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </button>
  );
}
