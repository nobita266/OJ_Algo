const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
function verifyToken(req, res, next) {
  console.log("i m here");
  const token = req.headers["authorization"]; // Assuming the token is sent in the Authorization header

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.userId = decoded.id; // Store the user ID from the token in the request object
    next();
  });
}
module.exports = { verifyToken };
