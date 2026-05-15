import express from 'express';
import { MenuThemeController } from './menutheme.controller.js';
import { menuThemeValidator } from './menutheme.validator.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { isAdminOrSeller } from '../../middlewares/isAdminOrSeller.middleware.js';

const themeRouter = express.Router();

// Public routes
themeRouter.get('/', MenuThemeController.getAllThemes);
themeRouter.get('/slug/:slug', menuThemeValidator.getBySlug, MenuThemeController.getThemeBySlug);
themeRouter.get('/restaurant/:id', MenuThemeController.getThemeByRestaurantId);
themeRouter.get('/restaurant/slug/:slug', MenuThemeController.getThemeByRestaurantSlug);

// Protected routes (Admin or Seller)
themeRouter.get('/mine', authenticate, isAdminOrSeller, MenuThemeController.getMyTheme);

// Public routes (continued)
themeRouter.get('/:id', menuThemeValidator.getById, MenuThemeController.getThemeById);

// Protected routes (Admin or Seller) (continued)
themeRouter.post('/', authenticate, isAdminOrSeller, menuThemeValidator.create, MenuThemeController.createTheme);
themeRouter.put('/:id', authenticate, isAdminOrSeller, menuThemeValidator.update, MenuThemeController.updateTheme);
themeRouter.delete('/:id', authenticate, isAdminOrSeller, menuThemeValidator.delete, MenuThemeController.deleteTheme);

export default themeRouter;
