const express = require("express");
const auth = require("../middlewares/auth");
const {
  createBus,
  listBuses,
  createRoute,
  listRoutes,
  assignBusToRoute,
  assignStudentToRoute,
  listStudentsForRoute,
} = require("../controllers/transportController");

const router = express.Router();

router.post("/buses", auth, createBus);
router.get("/buses", auth, listBuses);
router.post("/routes", auth, createRoute);
router.get("/routes", auth, listRoutes);
router.post("/assign-bus", auth, assignBusToRoute);
router.post("/assign-student", auth, assignStudentToRoute);
router.get("/routes/:routeId/students", auth, listStudentsForRoute);

module.exports = router;
