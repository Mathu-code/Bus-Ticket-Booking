import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT, 10), // Ensure port is an integer
  secure: process.env.EMAIL_SECURE === 'true', // Use 'true' if port is 465, 'false' for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendBookingConfirmationEmail = async (userEmail, subject, htmlContent, attachments) => {
  try {
    const mailOptions = {
      from: `BusGo <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: subject,
      html: htmlContent,
      attachments: attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${userEmail}: ${info.messageId}`);
  } catch (error) {
    console.error(`Error sending email to ${userEmail}:`, error);
    // In a production environment, you might want to log this error to a dedicated logging system
    // or use a retry mechanism.
    throw new Error('Failed to send booking confirmation email.');
  }
};