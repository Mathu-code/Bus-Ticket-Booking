// ...existing code...
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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