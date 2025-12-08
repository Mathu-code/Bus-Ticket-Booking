import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mathumathuran27@gmail.com",
    pass: "svmh okre lwwi qxlb"
  }
});

transporter.sendMail({
  from: "mathumathuran27@gmail.com",
  to: "mathumathuran27@gmail.com",
  subject: "Test Email from Node",
  text: "This is a test email"
}, (err, info) => {
  if (err) {
    console.error("FAILED:", err);
  } else {
    console.log("SUCCESS:", info.response);
  }
});
