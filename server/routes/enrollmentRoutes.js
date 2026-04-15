const express = require("express");
const router = express.Router();
const {
  enrollCourse,
  getMyCourses,
  joinCourseByCode,
  leaveCourse,
} = require("../controllers/enrollmentController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// join by code (students only)
router.post("/join", protect, authorize("student"), joinCourseByCode);

// enroll
router.post("/enroll/:courseId", protect, enrollCourse);

// leave course
router.delete("/:courseId", protect, authorize("student"), leaveCourse);

// my courses
router.get("/my-courses", protect, getMyCourses);

module.exports = router;
