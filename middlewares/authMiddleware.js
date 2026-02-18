const jwt = require("jsonwebtoken");
const { notAuthorziedCode } = require("../config/statuscodes");

// Auth Middleware to verify token
exports.verifyToken = (req, res, next) => {
  const authHeader =
    req.cookies?.token || req.headers.authorization;

  if (!authHeader) {
    return res
      .status(notAuthorziedCode)
      .json({ error: "Access Denied. No Token Provided." });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (error) {
    return res
      .status(notAuthorziedCode)
      .json({ error: "Invalid or Expired Token" });
  }
};

