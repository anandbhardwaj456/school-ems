import React, { useEffect, useState } from "react";
import api from "../api";

export default function FeesPage() {
  const [categories, setCategories] = useState([]);
  const [plans, setPlans] = useState([]);
  const [invoices, setInvoices] = useState([]);

  const [studentId, setStudentId] = useState("");

  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [loadingInvoices, setLoadingInvoices] = useState(false);

  const [errorCategories, setErrorCategories] = useState("");
  const [errorPlans, setErrorPlans] = useState("");
  const [errorInvoices, setErrorInvoices] = useState("");

  const [creatingCategory, setCreatingCategory] = useState(false);
  const [createCategoryError, setCreateCategoryError] = useState("");
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    isRecurring: false,
  });

  const [creatingPlan, setCreatingPlan] = useState(false);
  const [createPlanError, setCreatePlanError] = useState("");
  const [newPlan, setNewPlan] = useState({
    name: "",
    classId: "",
    academicYear: "",
  });

  const fetchCategories = async () => {
    setLoadingCategories(true);
    setErrorCategories("");
    try {
      const res = await api.get("/fees/categories");
      setCategories(res.data || []);
    } catch (err) {
      setErrorCategories(
        err.response?.data?.message || "Failed to load fee categories from server."
      );
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchPlans = async () => {
    setLoadingPlans(true);
    setErrorPlans("");
    try {
      const res = await api.get("/fees/plans");
      setPlans(res.data || []);
    } catch (err) {
      setErrorPlans(
        err.response?.data?.message || "Failed to load fee plans from server."
      );
    } finally {
      setLoadingPlans(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setCreatingCategory(true);
    setCreateCategoryError("");
    try {
      await api.post("/fees/categories", newCategory);
      setNewCategory({ name: "", description: "", isRecurring: false });
      fetchCategories();
    } catch (err) {
      setCreateCategoryError(
        err.response?.data?.message || "Failed to create category. Please try again."
      );
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    setCreatingPlan(true);
    setCreatePlanError("");
    try {
      const payload = {
        name: newPlan.name,
        classId: newPlan.classId || null,
        academicYear: newPlan.academicYear || null,
      };
      await api.post("/fees/plans", payload);
      setNewPlan({ name: "", classId: "", academicYear: "" });
      fetchPlans();
    } catch (err) {
      setCreatePlanError(
        err.response?.data?.message || "Failed to create plan. Please try again."
      );
    } finally {
      setCreatingPlan(false);
    }
  };

  const fetchInvoicesForStudent = async (e) => {
    if (e) e.preventDefault();
    if (!studentId) {
      setInvoices([]);
      setErrorInvoices("");
      return;
    }

    setLoadingInvoices(true);
    setErrorInvoices("");
    try {
      const res = await api.get(`/fees/students/${studentId}/invoices`);
      setInvoices(res.data || []);
    } catch (err) {
      setErrorInvoices(
        err.response?.data?.message ||
          "Failed to load invoices for the specified student."
      );
    } finally {
      setLoadingInvoices(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchPlans();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-800">Fees</h2>

      <p className="text-sm text-slate-600">
        View fee categories and plans, and quickly look up invoices for a specific
        student.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="px-4 py-2 border-b border-slate-200 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-700">Fee Categories</p>
            {loadingCategories && (
              <span className="text-xs text-slate-500">Loading...</span>
            )}
          </div>

          <div className="px-4 py-3 border-b border-slate-200 space-y-3 text-sm">
            <p className="text-xs font-medium text-slate-700">Quick Create Category</p>
            {createCategoryError && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                {createCategoryError}
              </div>
            )}
            <form
              onSubmit={handleCreateCategory}
              className="flex flex-wrap gap-3 items-end"
            >
              <div className="flex-1 min-w-[160px]">
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Category name"
                  required
                />
              </div>

              <div className="flex-1 min-w-[180px]">
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={newCategory.description}
                  onChange={(e) =>
                    setNewCategory((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Optional description"
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-700">
                <input
                  id="fees-recurring"
                  type="checkbox"
                  checked={newCategory.isRecurring}
                  onChange={(e) =>
                    setNewCategory((prev) => ({
                      ...prev,
                      isRecurring: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 border-slate-300 rounded"
                />
                <label htmlFor="fees-recurring">Recurring</label>
              </div>

              <button
                type="submit"
                disabled={creatingCategory}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md disabled:opacity-50"
              >
                {creatingCategory ? "Saving..." : "Create"}
              </button>
            </form>
          </div>

          {errorCategories && (
            <div className="px-4 py-2 text-sm text-red-600 bg-red-50 border-b border-red-200">
              {errorCategories}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                    Description
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                    Recurring
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 && !loadingCategories && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-6 text-center text-sm text-slate-500"
                    >
                      No categories found.
                    </td>
                  </tr>
                )}
                {categories.map((c) => (
                  <tr key={c.id || c.categoryId} className="border-b border-slate-100">
                    <td className="px-4 py-2">{c.name}</td>
                    <td className="px-4 py-2 text-xs text-slate-600">
                      {c.description || "-"}
                    </td>
                    <td className="px-4 py-2 text-xs">
                      <span className="inline-flex px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                        {c.isRecurring ? "Yes" : "No"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="px-4 py-2 border-b border-slate-200 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-700">Fee Plans</p>
            {loadingPlans && (
              <span className="text-xs text-slate-500">Loading...</span>
            )}
          </div>

          <div className="px-4 py-3 border-b border-slate-200 space-y-3 text-sm">
            <p className="text-xs font-medium text-slate-700">Quick Create Plan</p>
            {createPlanError && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                {createPlanError}
              </div>
            )}
            <form onSubmit={handleCreatePlan} className="flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-[160px]">
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newPlan.name}
                  onChange={(e) =>
                    setNewPlan((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Plan name"
                  required
                />
              </div>

              <div className="w-32">
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Class ID
                </label>
                <input
                  type="text"
                  value={newPlan.classId}
                  onChange={(e) =>
                    setNewPlan((prev) => ({ ...prev, classId: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="classId"
                />
              </div>

              <div className="w-40">
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Academic Year
                </label>
                <input
                  type="text"
                  value={newPlan.academicYear}
                  onChange={(e) =>
                    setNewPlan((prev) => ({
                      ...prev,
                      academicYear: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g. 2024-25"
                />
              </div>

              <button
                type="submit"
                disabled={creatingPlan}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md disabled:opacity-50"
              >
                {creatingPlan ? "Saving..." : "Create"}
              </button>
            </form>
          </div>

          {errorPlans && (
            <div className="px-4 py-2 text-sm text-red-600 bg-red-50 border-b border-red-200">
              {errorPlans}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                    Class ID
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                    Academic Year
                  </th>
                </tr>
              </thead>
              <tbody>
                {plans.length === 0 && !loadingPlans && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-6 text-center text-sm text-slate-500"
                    >
                      No plans found.
                    </td>
                  </tr>
                )}
                {plans.map((p) => (
                  <tr key={p.id || p.planId} className="border-b border-slate-100">
                    <td className="px-4 py-2">{p.name}</td>
                    <td className="px-4 py-2 text-xs text-slate-600">
                      {p.classId || "-"}
                    </td>
                    <td className="px-4 py-2 text-xs text-slate-600">
                      {p.academicYear || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-700">Student Invoices</p>
            <p className="text-xs text-slate-500">
              Enter a student ID to view all invoices generated for that student.
            </p>
          </div>

          <form
            onSubmit={fetchInvoicesForStudent}
            className="flex flex-wrap items-end gap-2"
          >
            <div className="w-40">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Student ID
              </label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="studentId"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
            >
              Lookup
            </button>
          </form>
        </div>

        {loadingInvoices && (
          <div className="px-4 py-2 text-xs text-slate-500 border-b border-slate-200">
            Loading invoices...
          </div>
        )}

        {errorInvoices && (
          <div className="px-4 py-2 text-sm text-red-600 bg-red-50 border-b border-red-200">
            {errorInvoices}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                  Invoice ID
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                  Due Date
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                  Total Amount
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 && !loadingInvoices && studentId && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-sm text-slate-500"
                  >
                    No invoices found for this student.
                  </td>
                </tr>
              )}
              {invoices.map((inv) => (
                <tr key={inv.invoiceId || inv.id} className="border-b border-slate-100">
                  <td className="px-4 py-2">{inv.invoiceId || inv.id}</td>
                  <td className="px-4 py-2 text-xs text-slate-600">
                    {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-600">
                    {inv.totalAmount != null ? `₹${inv.totalAmount}` : "-"}
                  </td>
                  <td className="px-4 py-2 text-xs">
                    <span className="inline-flex px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                      {inv.status || "-"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
