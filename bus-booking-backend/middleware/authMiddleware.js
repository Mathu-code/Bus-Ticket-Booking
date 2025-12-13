import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ msg: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // IMPORTANT: attach full user or at least userId
    req.user = {
      userId: decoded.userId,
      isAdmin: decoded.isAdmin,
    };

    next();
  } catch (error) {
    return res.status(401).json({ msg: "Not authorized, token failed" });
  }
};
