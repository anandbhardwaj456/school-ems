import React, { useEffect, useState } from "react";
import api from "../api";
import Table from "../components/Table";
import Modal from "../components/Modal";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import { useToast } from "../components/ToastProvider";

export default function SectionsPage() {
  const { showToast } = useToast();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    sectionName: "",
    classId: "",
    capacity: "",
    classTeacherId: "",
  });

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    setLoading(true);
    try {
      const res = await api.get("/sections").catch(() => ({ data: { data: [] } }));
      setSections(res.data?.data || []);
    } catch (err) {
      showToast("Failed to fetch sections", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSection = async (e) => {
    e.preventDefault();
    try {
      await api.post("/sections", formData);
      showToast("Section created successfully", "success");
      setShowAddModal(false);
      setFormData({ sectionName: "", classId: "", capacity: "", classTeacherId: "" });
      fetchSections();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to create section", "error");
    }
  };

  const columns = [
    { header: "Section Name", accessor: "sectionName" },
    { header: "Class ID", accessor: "classId" },
    { header: "Capacity", accessor: "capacity" },
    { header: "Class Teacher", accessor: "classTeacherId", render: (row) => row.classTeacherId || "-" },
    {
      header: "Actions",
      accessor: "actions",
      render: (row) => (
        <div className="flex gap-2">
          <button className="text-primary-600 hover:text-primary-700 text-xs font-medium">
            Edit
          </button>
          <button className="text-red-600 hover:text-red-700 text-xs font-medium">Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Sections</h2>
          <p className="text-sm text-slate-600 mt-1">Manage class sections</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>Add Section</Button>
      </div>

      <Table columns={columns} data={sections} loading={loading} emptyMessage="No sections found" />

      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setFormData({ sectionName: "", classId: "", capacity: "", classTeacherId: "" });
        }}
        title="Add New Section"
      >
        <form onSubmit={handleCreateSection} className="space-y-4">
          <FormInput
            label="Section Name"
            name="sectionName"
            value={formData.sectionName}
            onChange={(e) => setFormData({ ...formData, sectionName: e.target.value })}
            required
          />
          <FormInput
            label="Class ID"
            name="classId"
            value={formData.classId}
            onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
            required
          />
          <FormInput
            label="Capacity"
            name="capacity"
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
          />
          <FormInput
            label="Class Teacher ID"
            name="classTeacherId"
            value={formData.classTeacherId}
            onChange={(e) => setFormData({ ...formData, classTeacherId: e.target.value })}
          />
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowAddModal(false);
                setFormData({ sectionName: "", classId: "", capacity: "", classTeacherId: "" });
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Create Section</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

