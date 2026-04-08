const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const asyncHandler = require("express-async-handler");

const User = require("../models/UserModel");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/sendEmail");
const resetPasswordTemplate = require("../utils/emailTemplates/resetPasswordTemplate");

// ================= TOKEN =================
const generateAccessToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

const generateRefreshToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

// ================= SIGNUP =================
exports.signupUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return next(new AppError("User already exists", 400));

  await User.create({
    name,
    email,
    password,
    isVerified: true,
  });

  res.status(201).json({
    success: true,
    message: "Signup successful",
  });
});

// ================= LOGIN =================
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError("Invalid credentials", 401));
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshTokens.push({ token: refreshToken });
  await user.save();

  res.cookie("token", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    accessToken,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  });
});

// ================= LOGOUT =================
exports.logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token");
  res.clearCookie("refreshToken");

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});

// ================= REFRESH TOKEN =================
exports.refreshToken = asyncHandler(async (req, res, next) => {
  const token = req.cookies.refreshToken;

  if (!token) return next(new AppError("No refresh token", 401));

  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

  const user = await User.findById(decoded.id);

  if (!user) return next(new AppError("Invalid token", 403));

  const newAccessToken = generateAccessToken(user);

  res.cookie("token", newAccessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.status(200).json({
    success: true,
    accessToken: newAccessToken,
  });
});

// ================= FORGOT PASSWORD =================
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email required",
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(200).json({
      success: true,
      message: "If email exists, reset link sent",
    });
  }

  // TOKEN
  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  // URL
  const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  // TEMPLATE
  const html = resetPasswordTemplate(resetURL, user.name);

  // SEND MAIL
  await sendEmail({
    to: user.email,
    subject: "Password Reset",
    html,
  });

  res.status(200).json({
    success: true,
    message: "Reset link sent to email",
  });
});

// ================= RESET PASSWORD =================
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }).select("+password");

  if (!user) {
    return next(new AppError("Token invalid or expired", 400));
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  res.clearCookie("token");
  res.clearCookie("refreshToken");

  res.status(200).json({
    success: true,
    message: "Password reset successful",
  });
});

// ================= VERIFY EMAIL =================
exports.verifyEmail = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Email verified (demo)",
  });
});

// ================= RESEND =================
exports.resendVerification = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Verification email sent (demo)",
  });
});