exports.authorize = (...roles) => {
  return (req, res, next) => {
    try {
      // 1. Check user exists (from auth middleware)
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Not authenticated. Please login first.",
        });
      }

      // 2. Check role
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Role '${req.user.role}' is not allowed`,
        });
      }

      next();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Authorization error",
      });
    }
  };
};