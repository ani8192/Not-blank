require("dotenv").config({ path: __dirname + "/.env" });

console.log(" SERVER FILE EXECUTED");

const mongoose = require("mongoose");
const app = require("./app");

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error(" UNCAUGHT EXCEPTION:", err.message);
  process.exit(1);
});

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error(" MongoDB Error:", err.message);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;

// IMPORTANT: 0.0.0.0 allows access from mobile & other devices
const server = app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(" UNHANDLED REJECTION:", err.message);
  server.close(() => process.exit(1));
});