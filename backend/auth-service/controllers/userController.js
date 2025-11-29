import User from '../models/user.js';

// GET all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

// GET a single user by ID (optional if you want it)
export const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Invalid user id' });
    }
    // Validate ObjectId format to avoid CastError
    const isValid = /^[0-9a-fA-F]{24}$/.test(id);
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid user id format' });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
};
