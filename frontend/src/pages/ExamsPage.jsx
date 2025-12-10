import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../api";
import Table from "../components/Table";
import Modal from "../components/Modal";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import { useToast } from "../components/ToastProvider";

export default function ExamsPage() {
  const { isAdmin, isTeacher } = useAuth();
  const { showToast } = useToast();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showExamModal, setShowExamModal] = useState(false);
  const [showMarksModal, setShowMarksModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [marks, setMarks] = useState([]);
  const [formData, setFormData] = useState({
    examName: "",
    classId: "",
    subjectId: "",
    examDate: "",
    maxMarks: "",
    passingMarks: "",
  });

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const res = await api.get("/exams").catch(() => ({ data: { data: [] } }));
      setExams(res.data?.data || []);
    } catch (err) {
      showToast("Failed to fetch exams", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();
    try {
      await api.post("/exams", formData);
      showToast("Exam created successfully", "success");
      setShowExamModal(false);
      setFormData({
        examName: "",
        classId: "",
        subjectId: "",
        examDate: "",
        maxMarks: "",
        passingMarks: "",
      });
      fetchExams();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to create exam", "error");
    }
  };

  const handleViewMarks = async (exam) => {
    setSelectedExam(exam);
    try {
      const res = await api.get(`/exams/${exam.examId}/marks`).catch(() => ({ data: { data: [] } }));
      setMarks(res.data?.data || []);
      setShowMarksModal(true);
    } catch (err) {
      showToast("Failed to load marks", "error");
    }
  };

  const handleSaveMarks = async () => {
    try {
      await api.post(`/exams/${selectedExam.examId}/marks`, { marks });
      showToast("Marks saved successfully", "success");
      setShowMarksModal(false);
      setSelectedExam(null);
      setMarks([]);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to save marks", "error");
    }
  };

  const columns = [
    { header: "Exam Name", accessor: "examName" },
    { header: "Class", accessor: "classId", render: (row) => row.classId || "-" },
    { header: "Subject", accessor: "subjectId", render: (row) => row.subjectId || "-" },
    {
      header: "Date",
      accessor: "examDate",
      render: (row) => (row.examDate ? new Date(row.examDate).toLocaleDateString() : "-"),
    },
    {
      header: "Max Marks",
      accessor: "maxMarks",
      render: (row) => row.maxMarks || "-",
    },
    {
      header: "Actions",
      accessor: "actions",
      render: (row) => (
        <div className="flex gap-2">
          {(isAdmin || isTeacher) && (
            <button
              onClick={() => handleViewMarks(row)}
              className="text-primary-600 hover:text-primary-700 text-xs font-medium"
            >
              Enter Marks
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
          <h2 className="text-2xl font-bold text-slate-800">Exams</h2>
          <p className="text-sm text-slate-600 mt-1">Manage exams and enter marks</p>
        </div>
        {(isAdmin || isTeacher) && (
          <Button onClick={() => setShowExamModal(true)}>Create Exam</Button>
        )}
      </div>

      <Table columns={columns} data={exams} loading={loading} emptyMessage="No exams found" />

      {/* Create Exam Modal */}
      <Modal
        isOpen={showExamModal}
        onClose={() => {
          setShowExamModal(false);
          setFormData({
            examName: "",
            classId: "",
            subjectId: "",
            examDate: "",
            maxMarks: "",
            passingMarks: "",
          });
        }}
        title="Create New Exam"
        size="lg"
      >
        <form onSubmit={handleCreateExam} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Exam Name"
              name="examName"
              value={formData.examName}
              onChange={(e) => setFormData({ ...formData, examName: e.target.value })}
              required
            />
            <FormInput
              label="Class ID"
              name="classId"
              value={formData.classId}
              onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
            />
            <FormInput
              label="Subject ID"
              name="subjectId"
              value={formData.subjectId}
              onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
            />
            <FormInput
              label="Exam Date"
              name="examDate"
              type="date"
              value={formData.examDate}
              onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
            />
            <FormInput
              label="Max Marks"
              name="maxMarks"
              type="number"
              value={formData.maxMarks}
              onChange={(e) => setFormData({ ...formData, maxMarks: e.target.value })}
            />
            <FormInput
              label="Passing Marks"
              name="passingMarks"
              type="number"
              value={formData.passingMarks}
              onChange={(e) => setFormData({ ...formData, passingMarks: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowExamModal(false);
                setFormData({
                  examName: "",
                  classId: "",
                  subjectId: "",
                  examDate: "",
                  maxMarks: "",
                  passingMarks: "",
                });
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Create Exam</Button>
          </div>
        </form>
      </Modal>

      {/* Marks Entry Modal */}
      <Modal
        isOpen={showMarksModal}
        onClose={() => {
          setShowMarksModal(false);
          setSelectedExam(null);
          setMarks([]);
        }}
        title={`Enter Marks - ${selectedExam?.examName || ""}`}
        size="lg"
      >
        {selectedExam && (
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-600">
                Max Marks: <span className="font-medium">{selectedExam.maxMarks}</span> | Passing
                Marks: <span className="font-medium">{selectedExam.passingMarks}</span>
              </p>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                      Student
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                      Marks Obtained
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                      Grade
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {marks.map((mark, index) => (
                    <tr key={index} className="border-b border-slate-100">
                      <td className="px-4 py-2">{mark.studentName || mark.studentId}</td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={mark.marksObtained || ""}
                          onChange={(e) => {
                            const newMarks = [...marks];
                            newMarks[index].marksObtained = e.target.value;
                            const marksNum = parseFloat(e.target.value) || 0;
                            const percentage = (marksNum / selectedExam.maxMarks) * 100;
                            if (percentage >= 90) newMarks[index].grade = "A+";
                            else if (percentage >= 80) newMarks[index].grade = "A";
                            else if (percentage >= 70) newMarks[index].grade = "B+";
                            else if (percentage >= 60) newMarks[index].grade = "B";
                            else if (percentage >= 50) newMarks[index].grade = "C";
                            else if (marksNum >= selectedExam.passingMarks) newMarks[index].grade = "D";
                            else newMarks[index].grade = "F";
                            setMarks(newMarks);
                          }}
                          className="w-24 px-2 py-1 border border-slate-300 rounded text-sm"
                          max={selectedExam.maxMarks}
                        />
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            mark.grade === "F"
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {mark.grade || "-"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowMarksModal(false);
                  setSelectedExam(null);
                  setMarks([]);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveMarks}>Save Marks</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
