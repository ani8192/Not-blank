const globalErrorHandler = (err, req, res, next) => {
  console.log("REAL ERROR START");
  console.log("Error Name:", err.name);
  console.log("Error Message:", err.message);
  console.log("Stack:", err.stack);
  console.log("REAL ERROR END");

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: "error",
    message: err.message || "Internal Server Error",
    stack: err.stack,
  });
};

module.exports = globalErrorHandler;