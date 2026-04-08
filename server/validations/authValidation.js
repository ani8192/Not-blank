const Joi = require("joi");

/* ============================
   SIGNUP VALIDATION
============================ */

const signupSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .trim()
    .required(),

  email: Joi.string()
    .email()
    .trim()
    .required(),

  password: Joi.string()
    .min(6)
    .max(100)
    .required(),

  role: Joi.string()
    .valid("admin", "teacher", "student")
    .optional(),
});

/* ============================
   LOGIN VALIDATION
============================ */

const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .required(),
});

/* ============================
   FORGOT PASSWORD (LINK) VALIDATION
============================ */

const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),
});

/* ============================
   RESET PASSWORD (LINK) VALIDATION
============================ */

const resetPasswordSchema = Joi.object({
  password: Joi.string()
    .min(6)
    .max(100)
    .required(),
});

/* ============================
   OTP SEND VALIDATION
============================ */

const forgotPasswordOTPSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),
});

/* ============================
   OTP VERIFY + RESET VALIDATION
============================ */

const verifyOTPSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),

  otp: Joi.string()
    .length(6)
    .pattern(/^[0-9]+$/)
    .required(),

  password: Joi.string()
    .min(6)
    .max(100)
    .required(),
});

/* ============================
   EXPORT ALL SCHEMAS
============================ */

module.exports = {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  forgotPasswordOTPSchema,
  verifyOTPSchema,
};