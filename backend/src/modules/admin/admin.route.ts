import express from 'express';
import { AllSellers, BanUser, CreateSeller, UnBanUser, VerifySeller } from './admin.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { isAdmin } from '../../middlewares/isAdmin.middleware.js';
import { AdminValidate } from './admin.validator.js';

const adminRouter = express.Router();

adminRouter.get('/get/all/sellers', authenticate, isAdmin, AllSellers);
adminRouter.post('/verify/:id', authenticate, isAdmin, VerifySeller);
adminRouter.post('/ban/:id', authenticate, isAdmin, AdminValidate.banUser, BanUser);
adminRouter.post('/unban/:id', authenticate, isAdmin, AdminValidate.unBanUser, UnBanUser);
adminRouter.post('/create/seller', authenticate, isAdmin, AdminValidate.createSeller, CreateSeller);

export default adminRouter;
