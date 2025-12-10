import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../api";
import Table from "../components/Table";
import Modal from "../components/Modal";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import { useToast } from "../components/ToastProvider";

export default function HomeworkPage() {
  const { isAdmin, isTeacher, isStudent } = useAuth();
  const { showToast } = useToast();
  const [homework, setHomework] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedHomework, setSelectedHomework] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    classId: "",
    sectionId: "",
    dueDate: "",
    attachments: null,
  });
  const [submissionData, setSubmissionData] = useState({
    content: "",
    attachments: null,
  });

  useEffect(() => {
    fetchHomework();
  }, []);

  const fetchHomework = async () => {
    setLoading(true);
    try {
      const res = await api.get("/homework").catch(() => ({ data: { data: [] } }));
      setHomework(res.data?.data || []);
    } catch (err) {
      showToast("Failed to fetch homework", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHomework = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key !== "attachments" && formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });
      if (formData.attachments) {
        formDataToSend.append("file", formData.attachments);
      }

      await api.post("/homework", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showToast("Homework created successfully", "success");
      setShowCreateModal(false);
      setFormData({
        title: "",
        description: "",
        classId: "",
        sectionId: "",
        dueDate: "",
        attachments: null,
      });
      fetchHomework();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to create homework", "error");
    }
  };

  const handleSubmitHomework = async (e) => {
    e.preventDefault();
    if (!selectedHomework) return;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("homeworkId", selectedHomework.homeworkId);
      formDataToSend.append("content", submissionData.content);
      if (submissionData.attachments) {
        formDataToSend.append("file", submissionData.attachments);
      }

      await api.post("/homework/submit", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showToast("Homework submitted successfully", "success");
      setShowSubmitModal(false);
      setSelectedHomework(null);
      setSubmissionData({ content: "", attachments: null });
      fetchHomework();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to submit homework", "error");
    }
  };

  const columns = [
    { header: "Title", accessor: "title" },
    {
      header: "Class",
      accessor: "classId",
      render: (row) => (
        <span>
          {row.classId || "-"}
          {row.sectionId && ` / ${row.sectionId}`}
        </span>
      ),
    },
    {
      header: "Due Date",
      accessor: "dueDate",
      render: (row) => (row.dueDate ? new Date(row.dueDate).toLocaleDateString() : "-"),
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => {
        if (isStudent) {
          const status = row.submissionStatus || "PENDING";
          const colors = {
            SUBMITTED: "bg-green-100 text-green-800",
            PENDING: "bg-yellow-100 text-yellow-800",
            OVERDUE: "bg-red-100 text-red-800",
          };
          return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status] || "bg-slate-100 text-slate-800"}`}>
              {status}
            </span>
          );
        }
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
            {row.status || "ACTIVE"}
          </span>
        );
      },
    },
    {
      header: "Actions",
      accessor: "actions",
      render: (row) => (
        <div className="flex gap-2">
          {isStudent && row.submissionStatus !== "SUBMITTED" && (
            <button
              onClick={() => {
                setSelectedHomework(row);
                setShowSubmitModal(true);
              }}
              className="text-primary-600 hover:text-primary-700 text-xs font-medium"
            >
              Submit
            </button>
          )}
          <button className="text-slate-600 hover:text-slate-700 text-xs font-medium">View</button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Homework</h2>
          <p className="text-sm text-slate-600 mt-1">
            {isStudent ? "View and submit your homework" : "Manage homework assignments"}
          </p>
        </div>
        {(isAdmin || isTeacher) && (
          <Button onClick={() => setShowCreateModal(true)}>Create Homework</Button>
        )}
      </div>

      <Table columns={columns} data={homework} loading={loading} emptyMessage="No homework found" />

      {/* Create Homework Modal */}
      {(isAdmin || isTeacher) && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setFormData({
              title: "",
              description: "",
              classId: "",
              sectionId: "",
              dueDate: "",
              attachments: null,
            });
          }}
          title="Create Homework Assignment"
          size="lg"
        >
          <form onSubmit={handleCreateHomework} className="space-y-4">
            <FormInput
              label="Title"
              name="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
            <FormInput
              label="Due Date"
              name="dueDate"
              type="datetime-local"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              required
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Attach File (Optional)
              </label>
              <input
                type="file"
                onChange={(e) =>
                  setFormData({ ...formData, attachments: e.target.files[0] })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowCreateModal(false);
                  setFormData({
                    title: "",
                    description: "",
                    classId: "",
                    sectionId: "",
                    dueDate: "",
                    attachments: null,
                  });
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Create Homework</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Submit Homework Modal */}
      {isStudent && (
        <Modal
          isOpen={showSubmitModal}
          onClose={() => {
            setShowSubmitModal(false);
            setSelectedHomework(null);
            setSubmissionData({ content: "", attachments: null });
          }}
          title={`Submit Homework - ${selectedHomework?.title || ""}`}
          size="lg"
        >
          <form onSubmit={handleSubmitHomework} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Your Submission
              </label>
              <textarea
                name="content"
                value={submissionData.content}
                onChange={(e) => setSubmissionData({ ...submissionData, content: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Write your submission here..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Attach File (Optional)
              </label>
              <input
                type="file"
                onChange={(e) =>
                  setSubmissionData({ ...submissionData, attachments: e.target.files[0] })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowSubmitModal(false);
                  setSelectedHomework(null);
                  setSubmissionData({ content: "", attachments: null });
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
