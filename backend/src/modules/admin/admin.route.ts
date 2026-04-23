import express from 'express'
import { AllSellers, BanUser, UnBanUser, VerifySeller } from './admin.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { isAdmin } from '../../middlewares/isAdmin.middleware.js';

const adminRouter = express.Router();

adminRouter.get('/get/all/sellers', authenticate, isAdmin, AllSellers);
adminRouter.post('/verify/:id', authenticate, isAdmin, VerifySeller);
adminRouter.post('/ban/:id', authenticate, isAdmin, BanUser);
adminRouter.post('/unban/:id', authenticate, isAdmin, UnBanUser);

export default adminRouter;
