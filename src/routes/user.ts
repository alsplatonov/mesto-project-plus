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
  updateUserValidation,
  updateAvatarValidation,
} from '../utils/celebrate-validation';

const userRouter = Router();

userRouter.get('/', getAllUsers);
userRouter.get('/me', getCurrUser);
userRouter.get('/:userId', getUserById);
userRouter.patch('/me', updateUserValidation, updateUser);
userRouter.patch('/me/avatar', updateAvatarValidation, updateUserAvatar);

export default userRouter;
