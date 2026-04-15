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
  removeCourseStudent,
  checkCourseAccess,
} = require("../controllers/courseController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// ===============================
// COURSE ROUTES
// ===============================

// GET ALL COURSES
router.get("/", protect, getAllCourses);

// CREATE COURSE
router.post(
  "/",
  protect,
  authorize("teacher", "admin"),
  createCourse
);

// ===============================
// STATIC NAMED ROUTES FIRST
// (must come before any /:id routes)
// ===============================

// MY COURSES — must be before /:id or Express treats "my-courses" as an id
router.get(
  "/my-courses",
  protect,
  authorize("student"),
  getMyCourses
);

// ===============================
// DYNAMIC /:id ROUTES
// ===============================

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

// ENROLL
router.post(
  "/:id/enroll",
  protect,
  authorize("student"),
  enrollCourse
);

// CHECK COURSE ACCESS
router.get(
  "/:id/access",
  protect,
  checkCourseAccess
);

// GET COURSE STUDENTS
router.get(
  "/:id/students",
  protect,
  getCourseStudents
);

// REMOVE STUDENT FROM COURSE
router.delete(
  "/:courseId/students/:userId",
  protect,
  removeCourseStudent
);

module.exports = router;