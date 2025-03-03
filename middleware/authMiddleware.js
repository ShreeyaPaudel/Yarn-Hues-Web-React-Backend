const jwt = require("jsonwebtoken");


const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded; 
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};


const verifyAdmin = (req, res, next) => {
  exports.verifyToken(req, res, () => {
    if (req.user.role === "admin") {
      next();
    } else {
      res.status(403).json({ message: "Access denied. Admins only." });
    }
  });
};

module.exports = {verifyAdmin, verifyToken}