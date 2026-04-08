const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // ✅ FIRST check cookie
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // ❌ fallback (optional)
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Not authorized, no token", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  req.user = user;
  next();
});