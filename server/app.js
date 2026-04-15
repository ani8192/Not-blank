require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");

const globalErrorHandler = require("./middleware/errorMiddleware");
const AppError = require("./utils/appError");

const API_VERSION = "v1";
const app = express();

app.set("trust proxy", 1);

app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use(
  `/api/${API_VERSION}`,
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, try again later.",
  })
);

app.use(
  `/api/${API_VERSION}/auth`,
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: "Too many authentication attempts.",
  })
);

app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/admin`, adminRoutes);
app.use(`/api/${API_VERSION}/student`, studentRoutes);
app.use(`/api/${API_VERSION}/courses`, courseRoutes);
app.use("/api/v1/enrollments", enrollmentRoutes);

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Backend running",
    version: API_VERSION,
  });
});

app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
