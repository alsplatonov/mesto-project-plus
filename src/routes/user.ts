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
import {
  createUserValidation,
  updateUserValidation,
  updateAvatarValidation,
}

  from '../utils/celebrate-validation';

const userRouter = Router();

userRouter.get('/', getAllUsers);
userRouter.get('/me', getCurrUser);
userRouter.get('/:userId', getUserById);
userRouter.post('/', createUserValidation, createUser);
userRouter.patch('/me', updateUserValidation, updateUser);
userRouter.patch('/me/avatar', updateAvatarValidation, updateUserAvatar);

export default userRouter;
