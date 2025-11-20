import express from 'express';
import { getUsers, getUserById } from '../controllers/userController.js';

const router = express.Router();

router.get('/', getUsers);          // View all users
router.get('/:id', getUserById);     // View one user by ID

export default router;
