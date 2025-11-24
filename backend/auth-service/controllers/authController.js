import User from '../models/user.js';
import jwt from 'jsonwebtoken';

/* ============================
   REGISTER USER
============================= */
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



/* ============================
   LOGIN USER
============================= */
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

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
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    // Generate Refresh Token
    const refreshToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    // Store refresh token in secure HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,     // set to true if using HTTPS
      sameSite: 'strict',
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
