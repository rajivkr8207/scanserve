import express from 'express';
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from './category.controller.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';
import { UserRole } from '../../../../shared/types/user.type.js';
import { categoryValidator } from './category.validator.js';

const categoryRouter = express.Router();

// Protected routes for SELLER
categoryRouter.use(authenticate, authorize(UserRole.SELLER));

categoryRouter.post('/', categoryValidator.create, createCategory);
categoryRouter.get('/', getCategories);
categoryRouter.put('/:id', categoryValidator.update, updateCategory);
categoryRouter.delete('/:id', categoryValidator.delete, deleteCategory);

export default categoryRouter;
