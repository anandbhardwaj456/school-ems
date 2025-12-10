import React, { useEffect, useState } from "react";
import api from "../api";
import Table from "../components/Table";
import Modal from "../components/Modal";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import { useToast } from "../components/ToastProvider";

export default function StudentsPage() {
  const { showToast } = useToast();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState("list");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    admissionNo: "",
    classId: "",
    sectionId: "",
    dateOfBirth: "",
    address: "",
    parentName: "",
    parentPhone: "",
    parentEmail: "",
  });

  useEffect(() => {
    fetchStudents();
  }, [page, search, classId, sectionId]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (classId) params.classId = classId;
      if (sectionId) params.sectionId = sectionId;

      const res = await api.get("/students", { params });
      setStudents(res.data?.data || []);
      setTotalPages(res.data?.pagination?.totalPages || 1);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to load students", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      await api.post("/students", formData);
      showToast("Student added successfully", "success");
      setShowAddModal(false);
      resetForm();
      fetchStudents();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to add student", "error");
    }
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    const fileInput = e.target.file;
    if (!fileInput.files[0]) {
      showToast("Please select a file", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {
      await api.post("/students/bulk-upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showToast("Students uploaded successfully", "success");
      setShowBulkUploadModal(false);
      fetchStudents();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to upload students", "error");
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      admissionNo: "",
      classId: "",
      sectionId: "",
      dateOfBirth: "",
      address: "",
      parentName: "",
      parentPhone: "",
      parentEmail: "",
    });
  };

  const columns = [
    {
      header: "Name",
      accessor: "user",
      render: (row) => row.user?.fullName || "-",
    },
    {
      header: "Email",
      accessor: "user",
      render: (row) => row.user?.email || "-",
    },
    {
      header: "Admission No",
      accessor: "admissionNo",
    },
    {
      header: "Class",
      accessor: "classId",
    },
    {
      header: "Section",
      accessor: "sectionId",
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            row.status === "ACTIVE"
              ? "bg-green-100 text-green-800"
              : "bg-slate-100 text-slate-800"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: "actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelectedStudent(row);
              setActiveTab("profile");
            }}
            className="text-primary-600 hover:text-primary-700 text-xs font-medium"
          >
            View
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Students</h2>
          <p className="text-sm text-slate-600 mt-1">Manage student records and information</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowBulkUploadModal(true)} variant="secondary">
            Bulk Upload
          </Button>
          <Button onClick={() => setShowAddModal(true)}>Add Student</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="border-b border-slate-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab("list")}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "list"
                  ? "border-primary-600 text-primary-600"
                  : "border-transparent text-slate-600 hover:text-slate-800"
              }`}
            >
              Student List
            </button>
            {selectedStudent && (
              <>
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "profile"
                      ? "border-primary-600 text-primary-600"
                      : "border-transparent text-slate-600 hover:text-slate-800"
                  }`}
                >
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab("academics")}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "academics"
                      ? "border-primary-600 text-primary-600"
                      : "border-transparent text-slate-600 hover:text-slate-800"
                  }`}
                >
                  Academics
                </button>
                <button
                  onClick={() => setActiveTab("attendance")}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "attendance"
                      ? "border-primary-600 text-primary-600"
                      : "border-transparent text-slate-600 hover:text-slate-800"
                  }`}
                >
                  Attendance
                </button>
                <button
                  onClick={() => setActiveTab("fees")}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "fees"
                      ? "border-primary-600 text-primary-600"
                      : "border-transparent text-slate-600 hover:text-slate-800"
                  }`}
                >
                  Fees
                </button>
              </>
            )}
          </div>
        </div>

        <div className="p-6">
          {activeTab === "list" && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormInput
                  label="Search"
                  name="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Name or email"
                />
                <FormInput
                  label="Class ID"
                  name="classId"
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  placeholder="Class ID"
                />
                <FormInput
                  label="Section ID"
                  name="sectionId"
                  value={sectionId}
                  onChange={(e) => setSectionId(e.target.value)}
                  placeholder="Section ID"
                />
                <div className="flex items-end">
                  <Button onClick={fetchStudents} className="w-full">Filter</Button>
                </div>
              </div>

              {/* Table */}
              <Table
                columns={columns}
                data={students}
                loading={loading}
                emptyMessage="No students found"
              />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-600">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "profile" && selectedStudent && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Personal Information</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-slate-500">Full Name</p>
                      <p className="text-sm font-medium">{selectedStudent.user?.fullName || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Email</p>
                      <p className="text-sm font-medium">{selectedStudent.user?.email || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Admission Number</p>
                      <p className="text-sm font-medium">{selectedStudent.admissionNo || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Class</p>
                      <p className="text-sm font-medium">{selectedStudent.classId || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Section</p>
                      <p className="text-sm font-medium">{selectedStudent.sectionId || "-"}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-slate-500">Phone</p>
                      <p className="text-sm font-medium">{selectedStudent.user?.phone || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Address</p>
                      <p className="text-sm font-medium">{selectedStudent.address || "-"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "academics" && selectedStudent && (
            <div>
              <p className="text-slate-600">Academic records and exam results will appear here</p>
            </div>
          )}

          {activeTab === "attendance" && selectedStudent && (
            <div>
              <p className="text-slate-600">Attendance records will appear here</p>
            </div>
          )}

          {activeTab === "fees" && selectedStudent && (
            <div>
              <p className="text-slate-600">Fee records will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Student Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title="Add New Student"
        size="lg"
      >
        <form onSubmit={handleAddStudent} className="space-y-4">
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
            />
            <FormInput
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <FormInput
              label="Admission Number"
              name="admissionNo"
              value={formData.admissionNo}
              onChange={(e) => setFormData({ ...formData, admissionNo: e.target.value })}
              required
            />
            <FormInput
              label="Class ID"
              name="classId"
              value={formData.classId}
              onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
            />
            <FormInput
              label="Section ID"
              name="sectionId"
              value={formData.sectionId}
              onChange={(e) => setFormData({ ...formData, sectionId: e.target.value })}
            />
            <FormInput
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            />
            <FormInput
              label="Address"
              name="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            <FormInput
              label="Parent Name"
              name="parentName"
              value={formData.parentName}
              onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
            />
            <FormInput
              label="Parent Phone"
              name="parentPhone"
              value={formData.parentPhone}
              onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
            />
            <FormInput
              label="Parent Email"
              name="parentEmail"
              type="email"
              value={formData.parentEmail}
              onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowAddModal(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Add Student</Button>
          </div>
        </form>
      </Modal>

      {/* Bulk Upload Modal */}
      <Modal
        isOpen={showBulkUploadModal}
        onClose={() => setShowBulkUploadModal(false)}
        title="Bulk Upload Students"
      >
        <form onSubmit={handleBulkUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Upload CSV File
            </label>
            <input
              type="file"
              name="file"
              accept=".csv"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
              required
            />
            <p className="mt-2 text-xs text-slate-500">
              Download{" "}
              <a href="#" className="text-primary-600 hover:underline">
                template CSV
              </a>{" "}
              for reference
            </p>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowBulkUploadModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Upload</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
