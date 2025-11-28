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
    const secret = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET;
    const verified = jwt.verify(token, secret);
    
    // 3. Add user info to request so controllers can use it
    req.user = verified; 
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
