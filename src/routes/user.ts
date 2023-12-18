/* eslint-disable linebreak-style */
import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
  getCurrUser,
} from '../controllers/user';

import {
  userIdValidation,
  updateUserValidation,
  updateAvatarValidation,
} from '../utils/celebrate-validation';

const userRouter = Router();

userRouter.get('/', getAllUsers);
userRouter.get('/me', getCurrUser);
userRouter.get('/:userId', userIdValidation, getUserById);
userRouter.patch('/me', updateUserValidation, updateUser);
userRouter.patch('/me/avatar', updateAvatarValidation, updateUserAvatar);

export default userRouter;
