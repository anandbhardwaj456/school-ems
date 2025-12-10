import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../api";
import Table from "../components/Table";
import Modal from "../components/Modal";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import { useToast } from "../components/ToastProvider";

export default function FeesPage() {
  const { isAdmin, isParent } = useAuth();
  const { showToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [plans, setPlans] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isRecurring: false,
  });
  const [planData, setPlanData] = useState({
    name: "",
    classId: "",
    academicYear: "",
  });
  const [studentId, setStudentId] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchPlans();
    if (isParent) {
      fetchMyInvoices();
    }
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get("/fees/categories");
      setCategories(res.data?.data || []);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to load categories", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const res = await api.get("/fees/plans");
      setPlans(res.data?.data || []);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to load plans", "error");
    }
  };

  const fetchInvoicesForStudent = async () => {
    if (!studentId) return;
    setLoading(true);
    try {
      const res = await api.get(`/fees/students/${studentId}/invoices`);
      setInvoices(res.data?.data || []);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to load invoices", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyInvoices = async () => {
    setLoading(true);
    try {
      // Fetch invoices for logged-in parent's children
      const res = await api.get("/fees/my-invoices");
      setInvoices(res.data?.data || []);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to load invoices", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await api.post("/fees/categories", formData);
      showToast("Category created successfully", "success");
      setShowCategoryModal(false);
      setFormData({ name: "", description: "", isRecurring: false });
      fetchCategories();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to create category", "error");
    }
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    try {
      await api.post("/fees/plans", planData);
      showToast("Plan created successfully", "success");
      setShowPlanModal(false);
      setPlanData({ name: "", classId: "", academicYear: "" });
      fetchPlans();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to create plan", "error");
    }
  };

  const handlePayment = async () => {
    if (!selectedInvoice) return;
    try {
      await api.post(`/fees/invoices/${selectedInvoice.invoiceId}/pay`, {
        amount: selectedInvoice.totalAmount,
      });
      showToast("Payment processed successfully", "success");
      setShowPaymentModal(false);
      setSelectedInvoice(null);
      fetchInvoicesForStudent();
    } catch (err) {
      showToast(err.response?.data?.message || "Payment failed", "error");
    }
  };

  const categoryColumns = [
    { header: "Name", accessor: "name" },
    { header: "Description", accessor: "description", render: (row) => row.description || "-" },
    {
      header: "Recurring",
      accessor: "isRecurring",
      render: (row) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            row.isRecurring ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-800"
          }`}
        >
          {row.isRecurring ? "Yes" : "No"}
        </span>
      ),
    },
  ];

  const planColumns = [
    { header: "Name", accessor: "name" },
    { header: "Class ID", accessor: "classId", render: (row) => row.classId || "-" },
    { header: "Academic Year", accessor: "academicYear", render: (row) => row.academicYear || "-" },
  ];

  const invoiceColumns = [
    { header: "Invoice ID", accessor: "invoiceId" },
    {
      header: "Due Date",
      accessor: "dueDate",
      render: (row) => (row.dueDate ? new Date(row.dueDate).toLocaleDateString() : "-"),
    },
    {
      header: "Amount",
      accessor: "totalAmount",
      render: (row) => (row.totalAmount != null ? `₹${row.totalAmount.toLocaleString()}` : "-"),
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => {
        const status = row.status || "PENDING";
        const colors = {
          PAID: "bg-green-100 text-green-800",
          PENDING: "bg-yellow-100 text-yellow-800",
          OVERDUE: "bg-red-100 text-red-800",
        };
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status] || "bg-slate-100 text-slate-800"}`}>
            {status}
          </span>
        );
      },
    },
    {
      header: "Actions",
      accessor: "actions",
      render: (row) => (
        <div className="flex gap-2">
          {row.status !== "PAID" && (
            <button
              onClick={() => {
                setSelectedInvoice(row);
                setShowPaymentModal(true);
              }}
              className="text-primary-600 hover:text-primary-700 text-xs font-medium"
            >
              Pay Now
            </button>
          )}
          <button className="text-slate-600 hover:text-slate-700 text-xs font-medium">
            Download
          </button>
        </div>
      ),
    },
  ];

  if (isParent) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Fees</h2>
          <p className="text-sm text-slate-600 mt-1">View and pay fees for your children</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <p className="text-sm text-slate-600 mb-2">Total Due</p>
            <p className="text-2xl font-bold text-red-600">
              ₹{invoices
                .filter((inv) => inv.status !== "PAID")
                .reduce((sum, inv) => sum + (inv.totalAmount || 0), 0)
                .toLocaleString()}
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <p className="text-sm text-slate-600 mb-2">Paid This Month</p>
            <p className="text-2xl font-bold text-green-600">
              ₹{invoices
                .filter((inv) => inv.status === "PAID")
                .reduce((sum, inv) => sum + (inv.totalAmount || 0), 0)
                .toLocaleString()}
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <p className="text-sm text-slate-600 mb-2">Pending Invoices</p>
            <p className="text-2xl font-bold text-yellow-600">
              {invoices.filter((inv) => inv.status !== "PAID").length}
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">My Invoices</h3>
          <Table columns={invoiceColumns} data={invoices} loading={loading} emptyMessage="No invoices found" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Fees Management</h2>
          <p className="text-sm text-slate-600 mt-1">Manage fee categories, plans, and collections</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setShowPlanModal(true)}>
            Add Plan
          </Button>
          <Button onClick={() => setShowCategoryModal(true)}>Add Category</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Fee Categories</h3>
          </div>
          <Table
            columns={categoryColumns}
            data={categories}
            loading={loading}
            emptyMessage="No categories found"
          />
        </div>

        {/* Plans */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Fee Plans</h3>
          </div>
          <Table columns={planColumns} data={plans} loading={loading} emptyMessage="No plans found" />
        </div>
      </div>

      {/* Student Invoices Lookup */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Student Invoices</h3>
        </div>
        <div className="flex gap-2 mb-4">
          <FormInput
            label="Student ID"
            name="studentId"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Enter student ID"
            className="flex-1"
          />
          <div className="flex items-end">
            <Button onClick={fetchInvoicesForStudent}>Lookup</Button>
          </div>
        </div>
        <Table columns={invoiceColumns} data={invoices} loading={loading} emptyMessage="No invoices found" />
      </div>

      {/* Add Category Modal */}
      <Modal
        isOpen={showCategoryModal}
        onClose={() => {
          setShowCategoryModal(false);
          setFormData({ name: "", description: "", isRecurring: false });
        }}
        title="Add Fee Category"
      >
        <form onSubmit={handleCreateCategory} className="space-y-4">
          <FormInput
            label="Category Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <FormInput
            label="Description"
            name="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="recurring"
              checked={formData.isRecurring}
              onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
              className="h-4 w-4 border-slate-300 rounded"
            />
            <label htmlFor="recurring" className="text-sm text-slate-700">
              Recurring fee
            </label>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowCategoryModal(false);
                setFormData({ name: "", description: "", isRecurring: false });
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Create Category</Button>
          </div>
        </form>
      </Modal>

      {/* Add Plan Modal */}
      <Modal
        isOpen={showPlanModal}
        onClose={() => {
          setShowPlanModal(false);
          setPlanData({ name: "", classId: "", academicYear: "" });
        }}
        title="Add Fee Plan"
      >
        <form onSubmit={handleCreatePlan} className="space-y-4">
          <FormInput
            label="Plan Name"
            name="name"
            value={planData.name}
            onChange={(e) => setPlanData({ ...planData, name: e.target.value })}
            required
          />
          <FormInput
            label="Class ID"
            name="classId"
            value={planData.classId}
            onChange={(e) => setPlanData({ ...planData, classId: e.target.value })}
          />
          <FormInput
            label="Academic Year"
            name="academicYear"
            value={planData.academicYear}
            onChange={(e) => setPlanData({ ...planData, academicYear: e.target.value })}
            placeholder="e.g. 2024-25"
          />
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowPlanModal(false);
                setPlanData({ name: "", classId: "", academicYear: "" });
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Create Plan</Button>
          </div>
        </form>
      </Modal>

      {/* Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setSelectedInvoice(null);
        }}
        title="Process Payment"
      >
        {selectedInvoice && (
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Invoice ID:</span>
                <span className="text-sm font-medium">{selectedInvoice.invoiceId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Amount:</span>
                <span className="text-sm font-medium">
                  ₹{selectedInvoice.totalAmount?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Due Date:</span>
                <span className="text-sm font-medium">
                  {selectedInvoice.dueDate
                    ? new Date(selectedInvoice.dueDate).toLocaleDateString()
                    : "-"}
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedInvoice(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handlePayment}>Confirm Payment</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
