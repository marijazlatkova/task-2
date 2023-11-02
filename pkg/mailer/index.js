const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  secure: false,
  auth: {
    user: process.env.MAILTRAP_USERNAME,
    pass: process.env.MAILTRAP_PASSWORD
  },
});

const sendPasswordResetEmail = async (toEmail, resetLink) => {
  const mailOptions = {
    from: process.env.MAILTRAP_SENDER,
    to: toEmail,
    subject: "Password Reset Request",
    text: `To reset your password, please click on the following link: ${resetLink}`
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully:", info.response);
  } catch (err) {
    console.log("Error sending password reset email:", err);
  }
};

module.exports = {
  sendPasswordResetEmail
};