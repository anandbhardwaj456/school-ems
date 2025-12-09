import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import OtpVerificationPage from "./pages/OtpVerificationPage";
import DashboardLayout from "./layout/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import StudentsPage from "./pages/StudentsPage";
import TeachersPage from "./pages/TeachersPage";
import ClassesPage from "./pages/ClassesPage";
import FeesPage from "./pages/FeesPage";
import HomeworkPage from "./pages/HomeworkPage";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import LibraryPage from "./pages/LibraryPage";
import TransportPage from "./pages/TransportPage";
import MessagesPage from "./pages/MessagesPage";

const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-otp" element={<OtpVerificationPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="teachers" element={<TeachersPage />} />
        <Route path="classes" element={<ClassesPage />} />
        <Route path="fees" element={<FeesPage />} />
        <Route path="homework" element={<HomeworkPage />} />
        <Route path="announcements" element={<AnnouncementsPage />} />
        <Route path="library" element={<LibraryPage />} />
        <Route path="transport" element={<TransportPage />} />
        <Route path="messages" element={<MessagesPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
