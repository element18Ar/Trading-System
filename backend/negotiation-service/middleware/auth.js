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
    // 2. Verify token using your secret (Make sure .env has JWT_SECRET)
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Add user info to request so controllers can use it
    req.user = verified; 
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};