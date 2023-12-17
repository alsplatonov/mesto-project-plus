/* eslint-disable linebreak-style */
import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar,
  getCurrUser,
} from '../controllers/user';

const userRouter = Router();

userRouter.get('/', getAllUsers);
userRouter.get('/me', getCurrUser);
userRouter.get('/:userId', getUserById);
userRouter.post('/', createUser);
userRouter.patch('/me', updateUser);
userRouter.patch('/me/avatar', updateUserAvatar);

export default userRouter;
