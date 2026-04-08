const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["admin", "teacher", "student"],
      default: "student",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationToken: String,
    verificationTokenExpires: Date,
    verificationResendAfter: Date,

    refreshTokens: [
      {
        token: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    loginAttempts: {
      type: Number,
      default: 0,
    },

    lockUntil: {
      type: Date,
      default: null,
    },

    passwordResetToken: String,
    passwordResetExpires: Date,

    resetOtp: String,
    resetOtpExpires: Date,

    otpAttempts: {
      type: Number,
      default: 0,
    },

    otpResendAfter: Date,

    passwordChangedAt: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangedAt = Date.now() - 1000;
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.isLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now();
};

userSchema.methods.incrementLoginAttempts = async function () {
  const MAX_ATTEMPTS = 5;
  const LOCK_TIME = 10 * 60 * 1000;

  if (this.lockUntil && this.lockUntil < Date.now()) {
    this.loginAttempts = 1;
    this.lockUntil = null;
  } else {
    this.loginAttempts += 1;
  }

  if (this.loginAttempts >= MAX_ATTEMPTS) {
    this.lockUntil = Date.now() + LOCK_TIME;
  }

  await this.save();
};

userSchema.methods.resetLoginAttempts = async function () {
  this.loginAttempts = 0;
  this.lockUntil = null;
  await this.save();
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (!this.passwordChangedAt) return false;

  const changedTimestamp = parseInt(
    this.passwordChangedAt.getTime() / 1000,
    10
  );

  return JWTTimestamp < changedTimestamp;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

userSchema.methods.createOTPReset = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  this.resetOtp = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  this.resetOtpExpires = Date.now() + 5 * 60 * 1000;

  return otp;
};

module.exports = mongoose.model("User", userSchema);