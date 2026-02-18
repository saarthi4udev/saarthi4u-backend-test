const jwt = require("jsonwebtoken");

module.exports = function issueJwt(res, user) {
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,        // ✅ required for HTTPS
    sameSite: "none",    // ✅ required for cross-domain
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};
