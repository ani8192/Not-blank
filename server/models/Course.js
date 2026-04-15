const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    teacher: {
      type: String,
      ref: "User",
      required: true,
    },
    code: {
      type: String,
      unique: true,
      required: true,
    },
    joinCode: {
      type: String,
      unique: true,
      sparse: true, // legacy courses without a code; new courses always get joinCode in createCourse
    },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course; 
