const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

// ENROLL COURSE
exports.enrollCourse = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId } = req.params;

    // check already enrolled
    const alreadyEnrolled = await Enrollment.findOne({
      student: userId,
      course: courseId,
    });

    if (alreadyEnrolled) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    // create enrollment
    const enrollment = await Enrollment.create({
      student: userId,
      course: courseId,
    });

    res.status(201).json({
      message: "Enrolled successfully",
      enrollment,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// JOIN COURSE BY CODE (STUDENTS ONLY — enforced on route)
exports.joinCourseByCode = async (req, res) => {
  try {
    const { code } = req.body;

    if (code === undefined || code === null || String(code).trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Code is required",
      });
    }

    const course = await Course.findOne({ joinCode: code });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Invalid code",
      });
    }

    const userId = req.user._id;

    const existing = await Enrollment.findOne({
      student: userId,
      course: course._id,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Already enrolled",
      });
    }

    await Enrollment.create({
      student: userId,
      course: course._id,
    });

    res.status(200).json({
      success: true,
      message: "Enrollment successful",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// LEAVE COURSE
exports.leaveCourse = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({
      student: userId,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(404).json({
        status: "error",
        message: "Not enrolled",
      });
    }

    await enrollment.deleteOne();

    return res.status(200).json({
      status: "success",
      message: "Course left successfully",
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

// GET MY COURSES (STUDENT)
exports.getMyCourses = async (req, res) => {
  try {
    const userId = req.user._id;

    const courses = await Enrollment.find({ student: userId })
      .populate("course");

    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
