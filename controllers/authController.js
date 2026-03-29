const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const { Op } = require("sequelize");
const {
  duplicateDataCode,
  successCode,
  notFoundCode,
  badGatewayCode,
} = require("../config/statuscodes");
const issueJwt = require("../utils/issueJWT");
require("dotenv").config();

// User Registration
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(duplicateDataCode).json({ errors: errors.array() });
  }

  const { name, email, password, role } = req.body;

  // validate req.body
  if (!name || !email || !password || !role) {
    return res.status(duplicateDataCode).json({
      error: "All fields are required",
    });
  }

  // name should be at least 3 characters
  if (name.length < 3) {
    return res.status(duplicateDataCode).json({
      error: "Name must be at least 3 characters long",
    });
  }

  try {
    // Fetch all emails
    const users = await User.findAll({
      attributes: ["email"],
    });

    // check role should be only user, admin
    const validRoles = ["user", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(duplicateDataCode).json({
        error: "Invalid role. Allowed roles are: user, admin.",
      });
    }

    const existingEmails = users.map((user) => user.email.toLowerCase());

    // Check if provided email already exists
    if (existingEmails.includes(email.toLowerCase())) {
      return res
        .status(duplicateDataCode)
        .json({ error: "User already exists" });
    }

    // Create new user
    const user = await User.create({ name, email, password, role });

    res
      .status(successCode)
      .json({ message: "User created successfully", userId: user.id });
  } catch (error) {
    console.error(error);
    res.status(badGatewayCode).json({ error: "Server error" });
  }
};

// User Login
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(duplicateDataCode).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(duplicateDataCode)
        .json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(duplicateDataCode)
        .json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // JWT expires in 7 days
    );

    // for Production
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "None",
    //   maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expires in 7 days
    // });

    // For Testing
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // allow over HTTP
      sameSite: "Lax", // works fine for same-domain requests
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(successCode).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(badGatewayCode).json({ error: "Server error" });
  }
};

// Google Login using Firebase Authentication
exports.loginWithGoogle = async (req, res) => {
  try {
    const { uid, email, name } = req.firebaseUser;

    let user = await User.findOne({
      where: { firebaseUid: uid },
    });

    if (!user) {
      user = await User.create({
        name,
        email,
        role: "user",
        firebaseUid: uid,
        authProvider: "google",
      });
    }

    issueJwt(res, user);
    res.status(successCode).json({ message: "Google login successful", user });
  } catch (err) {
    res.status(badGatewayCode).json({ error: "Server error" });
  }
};

// Phone Login using Firebase Authentication
exports.loginWithPhone = async (req, res) => {
  try {
    const { uid, phone_number } = req.firebaseUser;

    let user = await User.findOne({
      where: { firebaseUid: uid },
    });

    if (!user) {
      user = await User.create({
        email: `${phone_number}@phone.firebase`,
        phone: phone_number,
        firebaseUid: uid,
        authProvider: "phone",
        name: "Phone User",
      });
    }

    issueJwt(res, user);
    res.status(successCode).json({ message: "Phone login successful", user });
  } catch (err) {
    res.status(badGatewayCode).json({ error: "Server error" });
  }
};

// Get User Profile
exports.getProfile = async (req, res) => {
  try {
    const decoded = jwt.verify(req.cookies?.token, process.env.JWT_SECRET);
    let userId = decoded;

    const user = await User.findByPk(userId.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(notFoundCode).json({ error: "User not found" });
    }

    res.status(successCode).json(user);
  } catch (error) {
    console.error(error);
    res.status(badGatewayCode).json({ error: "Server error" });
  }
};

// Logout (Clear Token Cookie)
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.status(successCode).json({ message: "Logout successful" });
};

// Get all emails
exports.getAllEmails = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["email"],
    });

    const emails = users.map((user) => user.email);

    res.status(successCode).json({ emails });
  } catch (error) {
    console.error("Error fetching emails:", error);
    res.status(badGatewayCode).json({ message: "Server Error", error });
  }
};

// Get all users optionally by role
exports.getUsersByRole = async (req, res) => {
  try {
    const { role } = req.query;
    const users = await User.fetchByRole(role);

    if (!users.length) {
      return res.status(notFoundCode).json({ message: "No users found" });
    }

    const sanitizedUsers = users.map((user) => {
      const { password, ...rest } = user.dataValues || user; // Handle Sequelize or plain object
      return rest;
    });

    res.status(successCode).json({ data: sanitizedUsers });
  } catch (error) {
    console.error(error);
    res.status(badGatewayCode).json({ error: "Server error" });
  }
};


// Update user details
exports.updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      password,
      phone,
      address,
      role,
      isActive,
    } = req.body;

    const user = await User.findByPk(id);

    if (!user || user.deletedAt) {
      return res.status(notFoundCode).json({ error: "User not found" });
    }

    // check role should be only user, admin
    const validRoles = ["user", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(duplicateDataCode).json({
        error: "Invalid role. Allowed roles are: user, admin.",
      });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;
    if (password) user.password = password;

    await user.save();

    res
      .status(successCode)
      .json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(badGatewayCode).json({ error: "Server error" });
  }
};
