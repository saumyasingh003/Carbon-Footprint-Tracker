import jwt from "jsonwebtoken";
import User from "../models/user.js";

const isAuthenticated = async (req, res, next) => {
  try {
    // Get token from cookies
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token provided",
      });
    }
    const token = authHeader.split(" ")[1];


    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token provided",
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Invalid token",
    });
  }
};

export default isAuthenticated;