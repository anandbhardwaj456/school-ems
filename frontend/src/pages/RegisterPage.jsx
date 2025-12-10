import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../api";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import Modal from "../components/Modal";
import { useToast } from "../components/ToastProvider";

export default function RegisterPage() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "student",
    phone: "",
    password: "",
    confirmPassword: "",
    status: "active",
    // Student-specific fields
    classId: "",
    sectionId: "",
    admissionNo: "",
    parentContact: "",
    // Parent-specific fields
    childLinking: "",
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Redirect if not admin
  React.useEffect(() => {
    if (!isAdmin) {
      showToast("Only administrators can create new users", "error");
      navigate("/", { replace: true });
    }
  }, [isAdmin, navigate, showToast]);

  const validateForm = () => {
    const newErrors = {};
    
    // Full Name
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    
    // Email
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Password
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    // Confirm Password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    // Role-specific validations
    if (formData.role === "student") {
      if (!formData.classId) {
        newErrors.classId = "Class is required for students";
      }
      if (!formData.admissionNo) {
        newErrors.admissionNo = "Admission number is required";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone || undefined,
        status: formData.status,
      };

      // Add role-specific fields
      if (formData.role === "student") {
        payload.classId = formData.classId;
        payload.sectionId = formData.sectionId;
        payload.admissionNo = formData.admissionNo;
        payload.parentContact = formData.parentContact || undefined;
      }

      if (formData.role === "parent") {
        payload.childLinking = formData.childLinking || undefined;
      }

      await api.post("/auth/register", payload);
      
      showToast("User created successfully", "success");
      setShowSuccessModal(true);
      
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        role: "student",
        phone: "",
        password: "",
        confirmPassword: "",
        status: "active",
        classId: "",
        sectionId: "",
        admissionNo: "",
        parentContact: "",
        childLinking: "",
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to create user";
      
      if (errorMessage.includes("email") && errorMessage.includes("unique")) {
        showToast("Email already exists. Please use a different email.", "error");
        setErrors({ ...errors, email: "Email already registered" });
      } else {
        showToast(errorMessage, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  if (!isAdmin) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-700 mb-2">SmartSkul EMS</h1>
          <h2 className="text-2xl font-semibold text-slate-800">Create New User</h2>
          <p className="text-sm text-slate-600 mt-2">Add a new user to the system</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleFieldChange("fullName", e.target.value)}
                  error={errors.fullName}
                  required
                />
                <FormInput
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  error={errors.email}
                  required
                />
                <FormInput
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleFieldChange("phone", e.target.value)}
                  placeholder="Optional"
                />
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={(e) => handleFieldChange("role", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="teacher">Teacher</option>
                    <option value="student">Student</option>
                    <option value="parent">Parent</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={(e) => handleFieldChange("status", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Password Fields */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Password</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleFieldChange("password", e.target.value)}
                  error={errors.password}
                  required
                />
                <FormInput
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleFieldChange("confirmPassword", e.target.value)}
                  error={errors.confirmPassword}
                  required
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Password must be at least 6 characters long
              </p>
            </div>

            {/* Student-Specific Fields */}
            {formData.role === "student" && (
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Student Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Class ID"
                    name="classId"
                    value={formData.classId}
                    onChange={(e) => handleFieldChange("classId", e.target.value)}
                    error={errors.classId}
                    required
                  />
                  <FormInput
                    label="Section ID"
                    name="sectionId"
                    value={formData.sectionId}
                    onChange={(e) => handleFieldChange("sectionId", e.target.value)}
                  />
                  <FormInput
                    label="Admission Number"
                    name="admissionNo"
                    value={formData.admissionNo}
                    onChange={(e) => handleFieldChange("admissionNo", e.target.value)}
                    error={errors.admissionNo}
                    required
                  />
                  <FormInput
                    label="Parent Contact"
                    name="parentContact"
                    value={formData.parentContact}
                    onChange={(e) => handleFieldChange("parentContact", e.target.value)}
                    placeholder="Optional"
                  />
                </div>
              </div>
            )}

            {/* Parent-Specific Fields */}
            {formData.role === "parent" && (
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Parent Information</h3>
                <FormInput
                  label="Link Child (Student ID)"
                  name="childLinking"
                  value={formData.childLinking}
                  onChange={(e) => handleFieldChange("childLinking", e.target.value)}
                  placeholder="Optional - Can be linked later"
                />
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/students")}
              >
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                Create User
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigate("/students");
        }}
        title="User Created Successfully"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            The user account has been created successfully. Login credentials have been sent to the user's email.
          </p>
          <div className="flex justify-end">
            <Button onClick={() => {
              setShowSuccessModal(false);
              navigate("/students");
            }}>
              View Users
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
