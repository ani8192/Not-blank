const resetPasswordTemplate = (resetURL, name) => {
  return `
    <h2>Password Reset</h2>
    <p>Hello ${name},</p>
    <p>Click the link below to reset your password:</p>
    <a href="${resetURL}" target="_blank">Reset Password</a>
    <p>This link will expire in 10 minutes.</p>
  `;
};

module.exports = resetPasswordTemplate;