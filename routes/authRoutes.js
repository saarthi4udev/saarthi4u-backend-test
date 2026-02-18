const express = require("express");
const { body, param, query } = require("express-validator");
const {
  register,
  login,
  getProfile,
  logout,
  getAllEmails,
  getUsersByRole,
  updateUserById,
  loginWithGoogle,
  loginWithPhone
} = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authMiddleware");
const loggerMiddleware = require("../middlewares/logMiddleware");
const { authLimiter } = require("../middlewares/rateLimiterMiddleware");
const { firebaseAuthMiddleware: firebaseAuth } = require("../middlewares/firebaseAuthMiddleware");

const router = express.Router();

// Register Route
router.post(
  "/register",
  authLimiter,
  loggerMiddleware,
  [
    body("name").isLength({ min: 3 }).withMessage("Name must be at least 3 characters long"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body("role").isIn(["admin", "user"]).withMessage("Invalid role"),
  ],
  register
);

// Login Route
router.post(
  "/login",
  authLimiter,
  loggerMiddleware,
  [body("email").isEmail(), body("password").notEmpty()],
  login
);

// 🔥 Firebase-based logins
router.post(
  "/login/google",
  firebaseAuth,
  loggerMiddleware,
  loginWithGoogle
);


router.post(
  "/login/phone",
  firebaseAuth,
  loggerMiddleware,
  loginWithPhone,
);

// Profile Route
router.get("/profile", loggerMiddleware, getProfile);

// Logout Route
router.get("/logout", verifyToken, loggerMiddleware, logout);

// Get all emails
router.get("/allEmails", loggerMiddleware, getAllEmails);

//Get all users by role optionally
router.get("/all",
  [
    query("role")
      .optional()
      .isIn(["admin", "user"])
      .withMessage("Invalid role specified"),
  ],
  verifyToken, loggerMiddleware, getUsersByRole);

// Update User by ID
router.put(
  "/updateUser/:id",
  verifyToken,
  loggerMiddleware,
  [
    param("id").isInt().withMessage("Invalid User ID"),
    body("email").optional().isEmail(),
    body("phone").optional().isNumeric(),
    body("name").optional().isString(),
    body("role").optional().isIn(["teacher", "student", "staff"]),
    body("address").optional().isString(),
    body("phone")
      .optional()
      .isNumeric()
      .withMessage("Phone number must be a valid number"),
    body("isActive")
      .optional()
      .isBoolean()
      .withMessage("isActive must be a boolean value"),
    body("password")
      .optional()
      .isString()
      .withMessage("Password must be at least 6 characters long"),
  ],
  updateUserById
);

module.exports = router;
