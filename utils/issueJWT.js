const jwt = require("jsonwebtoken");

const issueJwt = (res, user) => {
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "Lax",
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};

module.exports = issueJwt;
