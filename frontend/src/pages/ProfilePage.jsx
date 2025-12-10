import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../api";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import { useToast } from "../components/ToastProvider";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put("/auth/profile", formData);
      if (res.data?.success) {
        updateUser(res.data.user);
        showToast("Profile updated successfully", "success");
        setEditing(false);
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">My Profile</h2>
          <p className="text-sm text-slate-600 mt-1">Manage your profile information</p>
        </div>
        {!editing && (
          <Button variant="secondary" onClick={() => setEditing(true)}>
            Edit Profile
          </Button>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-800">{user?.fullName}</h3>
            <p className="text-sm text-slate-600">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full capitalize">
              {user?.role}
            </span>
          </div>
        </div>

        {editing ? (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
              <FormInput
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled
              />
              <FormInput
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <FormInput
                label="Address"
                name="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setEditing(false);
                  setFormData({
                    fullName: user?.fullName || "",
                    email: user?.email || "",
                    phone: user?.phone || "",
                    address: user?.address || "",
                  });
                }}
              >
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                Save Changes
              </Button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-slate-500 mb-1">Full Name</p>
              <p className="text-sm font-medium">{user?.fullName || "-"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Email</p>
              <p className="text-sm font-medium">{user?.email || "-"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Phone</p>
              <p className="text-sm font-medium">{user?.phone || "-"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Role</p>
              <p className="text-sm font-medium capitalize">{user?.role || "-"}</p>
            </div>
            {user?.address && (
              <div className="md:col-span-2">
                <p className="text-xs text-slate-500 mb-1">Address</p>
                <p className="text-sm font-medium">{user.address}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

