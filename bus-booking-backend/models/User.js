import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  otpCode: { type: String },
  otpExpire: { type: Date },
  resetToken: { type: String },
  resetTokenExpire: { type: Date },

}, { timestamps: true });

export default mongoose.model("User", userSchema);
