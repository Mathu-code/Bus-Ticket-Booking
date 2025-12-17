// ...existing code...
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
// Register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ msg: "All fields required" });
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ msg: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed });
    await user.save();

    res.status(201).json({ msg: "User registered" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: "All fields required" });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      }
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const { search } = req.query; // Get search query parameter
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } }, // Case-insensitive search on name
        { email: { $regex: search, $options: 'i' } }, // Case-insensitive search on email
      ];
    }
    const users = await User.find(filter).select('-password'); // Exclude password field
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// @desc    Get user by ID (Admin only)
// @route   GET /api/admin/users/:id
// @access  Private/Admin
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ msg: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// @desc    Update user (Admin only)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      // Admin status can only be updated by another admin, not self-demotion/promotion
      if (req.body.isAdmin !== undefined && req.user._id.toString() !== user._id.toString()) {
        user.isAdmin = req.body.isAdmin;
      }

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(404).json({ msg: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      // Prevent admin from deleting themselves
      if (req.user._id.toString() === user._id.toString()) {
        return res.status(400).json({ msg: 'Cannot delete yourself' });
      }
      await user.deleteOne(); // Use deleteOne() for Mongoose 6+
      res.json({ msg: 'User removed' });
    } else {
      res.status(404).json({ msg: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// @desc    Toggle user admin status (Admin only)
// @route   PATCH /api/admin/users/:id/toggle-admin
// @access  Private/Admin
export const toggleAdminStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      // Prevent admin from changing their own admin status via this endpoint
      if (req.user._id.toString() === user._id.toString()) {
        return res.status(400).json({ msg: 'Cannot change your own admin status via this endpoint' });
      }
      user.isAdmin = !user.isAdmin;
      const updatedUser = await user.save();
      res.json({ msg: 'User admin status updated', isAdmin: updatedUser.isAdmin });
    } else {
      res.status(404).json({ msg: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Send OTP
export const sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ msg: "Email is required" });

  const user = await User.findOne({ email });
  if (!user) {
    // Tell the frontend there's no such user
    return res.status(404).json({ msg: "No account found with this email." });
  }

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otpCode = otp;
  user.otpExpire = Date.now() + 1000 * 60 * 10; // 10 min
  await user.save();

  // Send OTP via email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mathumathuran27@gmail.com", // your gmail or app password
      pass: "cgue leum hghr hhqd",
    },
  });

  await transporter.sendMail({
    from: '"BusGo" <support@busgo.com>',
    to: email,
    subject: "BusGo Password Reset OTP",
    html: `
      <h2>OTP for Password Reset</h2>
      <p>Your OTP is: <b>${otp}</b></p>
      <p>This OTP is valid for 10 minutes.</p>
    `,
  });

  return res.status(200).json({ msg: "OTP sent to your email address." });
};


// Verify OTP and return token
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email, otpCode: otp, otpExpire: { $gt: Date.now() } });
  if (!user) return res.status(400).json({ msg: "Invalid or expired OTP" });

  // Generate reset token (can use JWT or random string)
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.resetTokenExpire = Date.now() + 1000 * 60 * 15; // 15 min
  // Clear OTP
  user.otpCode = undefined;
  user.otpExpire = undefined;
  await user.save();

  // Send the token to frontend (do NOT email it)
  res.json({ token: resetToken });
};

// Reset password using reset token
export const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!password || !token) return res.status(400).json({ msg: "Missing info" });

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetToken: hashedToken,
    resetTokenExpire: { $gt: Date.now() }
  });

  if (!user) return res.status(400).json({ msg: "Invalid or expired token" });

  user.password = await bcrypt.hash(password, 10);
  user.resetToken = undefined;
  user.resetTokenExpire = undefined;
  await user.save();

  res.json({ msg: "Password reset successful. Please login." });
};
