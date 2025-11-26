import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access Denied: No Token Provided' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const secret = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET
    const verified = jwt.verify(token, secret)
    req.user = verified
    next()
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' })
  }
}
