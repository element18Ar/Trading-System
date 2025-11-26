import User from '../models/user.js';
import jwt from 'jsonwebtoken';

//register user
export const Register = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    const role = 'user';

    // Check password match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create new user (password auto-hashes in model)
    const user = new User({ username, email, password, role });
    await user.save();

    res.status(201).json({
      message: 'Registered successfully',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to register', error: error.message });
  }
};


//login user
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare password using bcrypt method
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate Access Token
    const accessSecret = process.env.JWT_SECRET || process.env.ACCESS_TOKEN_SECRET;
    const refreshSecret = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET;
    if (!accessSecret || !refreshSecret) {
      return res.status(500).json({ message: 'Server configuration error: missing JWT secrets' });
    }

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      accessSecret,
      { expiresIn: '15m' }
    );

    // Generate Refresh Token
    const refreshToken = jwt.sign(
      { id: user._id, role: user.role },
      refreshSecret,
      { expiresIn: '7d' }
    );

    // Store refresh token in secure HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    res.json({
      message: 'Login successful',
      accessToken,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

export const RefreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token provided' });
    }

    const accessSecret = process.env.JWT_SECRET || process.env.ACCESS_TOKEN_SECRET;
    const refreshSecret = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET;
    if (!accessSecret || !refreshSecret) {
      return res.status(500).json({ message: 'Server configuration error: missing JWT secrets' });
    }

    jwt.verify(refreshToken, refreshSecret, (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Invalid refresh token' });

      const accessToken = jwt.sign(
        { id: decoded.id, role: decoded.role },
        accessSecret,
        { expiresIn: '15m' }
      );

      res.json({ accessToken });
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to refresh token', error: error.message });
  }
};
