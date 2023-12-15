import { Router } from 'express';
import { getAllUsers, getUserById, createUser, updateUser, updateUserAvatar } from '../controllers/user';


const userRouter = Router();

userRouter.get('/', getAllUsers);
userRouter.get('/:userId', getUserById);
userRouter.post('/', createUser);
userRouter.patch('/me', updateUser);
userRouter.patch('/me/avatar', updateUserAvatar);

export default userRouter;
