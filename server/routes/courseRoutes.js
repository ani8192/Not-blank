const express = require("express");
const router = express.Router();

const {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  getMyCourses,
  getCourseStudents,
} = require("../controllers/courseController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// ===============================
// COURSE ROUTES
// ===============================

// GET ALL COURSES ✅
router.get("/",protect, getAllCourses); 

// CREATE COURSE
router.post(
  "/",
  protect,
  authorize("teacher", "admin"),
  createCourse
);

// UPDATE COURSE
router.patch(
  "/:id",
  protect,
  authorize("teacher", "admin"),
  updateCourse
);

// DELETE COURSE
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteCourse
);

// ===============================
// ENROLLMENT ROUTES
// ===============================

// ENROLL
router.post(
  "/:id/enroll",
  protect,
  authorize("student"),
  enrollCourse
);

// MY COURSES
router.get(
  "/my-courses",
  protect,
  authorize("student"),
  getMyCourses
);

// ===============================
// COURSE STUDENTS
// ===============================

router.get(
  "/:id/students",
  protect,
  authorize("teacher", "admin"),
  getCourseStudents
);

module.exports = router;