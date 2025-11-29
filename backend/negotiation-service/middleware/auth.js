// backend/negotiation-service/middleware/auth.js
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  // 1. Get token from header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Access Denied: No Token Provided" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const accessSecret = process.env.ACCESS_TOKEN_SECRET;
    const serviceSecret = process.env.JWT_SECRET;

    let verified;
    if (accessSecret) {
      try {
        verified = jwt.verify(token, accessSecret);
      } catch (_) {}
    }
    if (!verified && serviceSecret) {
      try {
        verified = jwt.verify(token, serviceSecret);
      } catch (_) {}
    }

    if (!verified) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
