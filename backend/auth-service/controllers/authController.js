import User from '../models/user.js';
// REGISTER
export const Register = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    const role = 'user';

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = new User({ username, email, password, role });
    await user.save();

    res.status(201).json({ message: 'registered successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to register', error: error.message });
  }
};



// LOGIN
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: 'user' });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      message: 'login successful',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'login failed', error: error.message });
  }
};

