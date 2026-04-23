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

const authRouter = Router();

authRouter.post('/register', userValidator.register, registerUser);
authRouter.post('/login', userValidator.login, loginUser);
authRouter.post('/logout', Logout);
authRouter.get('/profile', authenticate, getCurrentUser);
authRouter.post('/verify/:email', userValidator.verify, verifyUser);
authRouter.post('/forgot-password', userValidator.forgotPassword, forgotPassword);
authRouter.post('/reset-password/:email', userValidator.resetPassword, resetPassword);

export default authRouter;
