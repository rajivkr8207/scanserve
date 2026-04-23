import { Router } from 'express';
import {
  forgotPassword,
  getCurrentUser,
  loginUser,
  Logout,
  registerUser,
  resetPassword,
  verifyUser,
} from './user.controller.js';
import { userValidator } from './user.validator.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const userRouter = Router();

userRouter.post('/register', userValidator.register, registerUser);
userRouter.post('/login', userValidator.login, loginUser);
userRouter.post('/logout', Logout);
userRouter.get('/profile', authenticate, getCurrentUser);
userRouter.post('/verify/:email', userValidator.verify, verifyUser);
userRouter.post('/forgot-password', userValidator.forgotPassword, forgotPassword);
userRouter.post('/reset-password/:email', userValidator.resetPassword, resetPassword);

export default userRouter;
