import rateLimit from "express-rate-limit";

export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    status: "fail",
    message: "Too many reset attempts. Try again later."
  },
  standardHeaders: true,
  legacyHeaders: false
});