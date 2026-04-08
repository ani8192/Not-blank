const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/UserModel");

// ================= AUTH ROUTES =================

// SIGNUP
router.post("/signup", authController.signupUser);

// LOGIN
router.post("/login", authController.loginUser);

// LOGOUT
router.post("/logout", authController.logoutUser);

// REFRESH TOKEN
router.post("/refresh-token", authController.refreshToken);

// FORGOT PASSWORD
router.post("/forgot-password", authController.forgotPassword);

// RESET PASSWORD
router.patch("/reset-password/:token", authController.resetPassword);

// VERIFY EMAIL (optional - if used)
router.get("/verify/:token", authController.verifyEmail);

// RESEND VERIFICATION (optional)
router.post("/resend-verification", authController.resendVerification);

// ================= PROTECTED =================

router.get("/me", protect, (req, res) => {
  res.status(200).json({
    status: "success",
    data: { user: req.user },
  });
});

// ================= CHECK EMAIL =================

router.post("/check-email", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const exists = await User.exists({ email: normalizedEmail });

    res.status(200).json({
      success: true,
      exists: !!exists,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;