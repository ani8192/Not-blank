import AuditLog from "../models/AuditLog.js";

export const logSecurityEvent = async (req, userId, action, metadata = {}) => {
  await AuditLog.create({
    user: userId,
    action,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
    metadata
  });
};