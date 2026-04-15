const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const generateCode = require("../utils/generateCode");
const mongoose = require("mongoose");

// ===============================
// GET ALL COURSES
// ===============================
exports.getAllCourses = async (req, res) => {
  try {
    // 1. Safety check
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized",
      });
    }

    const userId = req.user._id;

    // 2. Normalize role
    const role = req.user.role.toLowerCase();

    let courses = [];

    if (role === "student") {
      // 3. Find enrollments using "user" field, extract valid course IDs only
      const enrollments = await Enrollment.find({ student: userId }).lean();

      const courseIds = enrollments
        .map((e) => e.course)
        .filter((id) => mongoose.Types.ObjectId.isValid(id));

      // Fetch courses using $in
      courses =
        courseIds.length > 0
          ? await Course.find({ _id: { $in: courseIds } }).lean()
          : [];
    } else if (role === "teacher") {
      // 4. Teacher sees own courses
      courses = await Course.find({ teacher: userId }).lean();
    } else if (role === "admin") {
      // 5. Admin sees all courses
      courses = await Course.find().lean();
    }

    // 6. Populate teacher safely
    try {
      courses = await Course.populate(courses, {
        path: "teacher",
        select: "name email",
      });
    } catch (populateErr) {
      console.warn("Teacher populate failed, skipping:", populateErr.message);
    }

    // 7. Return
    return res.status(200).json({
      status: "success",
      courses,
    });
  } catch (error) {
    console.error("GET COURSES ERROR:", error);

    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// ===============================
// CREATE COURSE
// ===============================
exports.createCourse = async (req, res) => {
  try {
    const { title } = req.body;
    const code = generateCode();

    const course = await Course.create({
      title,
      teacher: req.user._id,
      code,
      joinCode: code,
    });

    console.log("JOIN CODE:", code);

    res.status(201).json({
      success: true,
      data: course,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
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

    if (req.user.role === "admin") {
      const enrollments = await Enrollment.find({ course: courseId })
        .populate("student", "name email");

      const students = enrollments.map((enrollment) => enrollment.student);

      return res.status(200).json({
        status: "success",
        students,
      });
    }

    if (
      req.user.role === "teacher" &&
      course.teacher.toString() === req.user._id.toString()
    ) {
      const enrollments = await Enrollment.find({ course: courseId })
        .populate("student", "name email");

      const students = enrollments.map((enrollment) => enrollment.student);

      return res.status(200).json({
        status: "success",
        students,
      });
    }

    return res.status(403).json({
      success: false,
      message: "Not authorized",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch students",
    });
  }
};

// ===============================
// REMOVE COURSE STUDENT
// ===============================
exports.removeCourseStudent = async (req, res) => {
  try {
    const { courseId, userId } = req.params;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (req.user.role !== "admin") {
      if (
        req.user.role !== "teacher" ||
        course.teacher.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "Not authorized",
        });
      }
    }

    const enrollment = await Enrollment.findOne({
      course: courseId,
      student: userId,
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Student not enrolled",
      });
    }

    await enrollment.deleteOne();

    return res.status(200).json({
      status: "success",
      message: "Student removed successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to remove student",
    });
  }
};

// ===============================
// CHECK COURSE ACCESS
// ===============================
exports.checkCourseAccess = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.teacher.toString() === req.user._id.toString()) {
      return res.status(200).json({
        success: true,
        access: true,
      });
    }

    const existing = await Enrollment.findOne({
      student: req.user._id,
      course: course._id,
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        access: true,
      });
    }

    return res.status(403).json({
      success: false,
      message: "You are not enrolled in this course",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to check course access",
    });
  }
};
