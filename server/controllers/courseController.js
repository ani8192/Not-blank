const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const User = require("../models/UserModel");

// ===============================
// GET ALL COURSES
// ===============================
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("teacher", "name email");

    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error fetching courses",
    });
  }
};

// ===============================
// CREATE COURSE
// ===============================
exports.createCourse = async (req, res) => {
  try {
    const { title } = req.body;

    const course = await Course.create({
      title,
      teacher: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: course,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error creating course",
    });
  }
};

// ===============================
// UPDATE COURSE
// ===============================
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Teacher can only update own course
    if (
      req.user.role === "teacher" &&
      course.teacher.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error updating course",
    });
  }
};

// ===============================
// DELETE COURSE
// ===============================
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error deleting course",
    });
  }
};

// ===============================
// ENROLL COURSE
// ===============================
exports.enrollCourse = async (req, res) => {
  try {
    const userId = req.user._id;
    const courseId = req.params.id;

    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can enroll",
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const existing = await Enrollment.findOne({
      student: userId,
      course: courseId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Already enrolled",
      });
    }

    await Enrollment.create({
      student: userId,
      course: courseId,
    });

    res.status(200).json({
      success: true,
      message: "Enrolled successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Enrollment failed",
    });
  }
};

// ===============================
// GET MY COURSES
// ===============================
exports.getMyCourses = async (req, res) => {
  try {
    const userId = req.user._id;

    const enrollments = await Enrollment.find({ student: userId })
      .populate("course")
      .populate("student");

    const courses = enrollments.map((e) => e.course);

    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
    });
  }
};

// ===============================
// GET COURSE STUDENTS
// ===============================
exports.getCourseStudents = async (req, res) => {
  try {
    const courseId = req.params.id;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (
      req.user.role === "teacher" &&
      course.teacher.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const enrollments = await Enrollment.find({ course: courseId })
      .populate("student", "name email");

    const students = enrollments.map((e) => e.student);

    res.status(200).json({
      success: true,
      data: students,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch students",
    });
  }
};