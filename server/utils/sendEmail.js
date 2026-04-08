const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `"School Support" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  console.log("EMAIL SUCCESS:", info.response);
};

module.exports = sendEmail;