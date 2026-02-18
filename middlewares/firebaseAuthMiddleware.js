// middlewares/firebaseAuthMiddleware.js
const admin = require("../config/firebase");

exports.firebaseAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) {
      return res.status(401).json({ error: "Firebase token missing" });
    }

    const decoded = await admin.auth().verifyIdToken(token);
    req.firebaseUser = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid Firebase token" });
  }
};

// module.exports = firebaseAuthMiddleware;
