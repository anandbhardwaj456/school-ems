const express = require("express");
const auth = require("../middlewares/auth");
const {
  createCategory,
  listCategories,
  createPlan,
  listPlans,
  assignPlanToStudent,
  createInvoice,
  listInvoicesForStudent,
  recordPayment,
} = require("../controllers/feeController");

const router = express.Router();

// Categories
router.post("/categories", auth, createCategory);
router.get("/categories", auth, listCategories);

// Plans
router.post("/plans", auth, createPlan);
router.get("/plans", auth, listPlans);

// Assignments
router.post("/assignments", auth, assignPlanToStudent);

// Invoices & payments
router.post("/invoices", auth, createInvoice);
router.get("/students/:studentId/invoices", auth, listInvoicesForStudent);
router.post("/payments", auth, recordPayment);

module.exports = router;
