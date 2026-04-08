const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.get(
  "/profile",
  protect,
  authorize("student"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Student 🎓",
      user: req.user,
    });
  }
);

module.exports = router;