import type { Request, Response } from 'express';
import { MenuThemeService } from './menutheme.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';

export const MenuThemeController = {
  createTheme: asyncHandler(async (req: Request, res: Response) => {
    const adminId = (req as any).user?._id;
    const theme = await MenuThemeService.createTheme(req.body, adminId);
    res.status(201).json(new ApiResponse(201, theme, 'Theme created successfully'));
  }),

  getAllThemes: asyncHandler(async (req: Request, res: Response) => {
    const filter = req.query.isActive ? { isActive: req.query.isActive === 'true' } : {};
    const themes = await MenuThemeService.getAllThemes(filter);
    res.status(200).json(new ApiResponse(200, themes, 'Themes fetched successfully'));
  }),

  getThemeById: asyncHandler(async (req: Request, res: Response) => {
    const theme = await MenuThemeService.getThemeById(req.params.id as string);
    if (!theme) {
      throw new ApiError(404, 'Theme not found');
    }
    res.status(200).json(new ApiResponse(200, theme, 'Theme fetched successfully'));
  }),

  getThemeBySlug: asyncHandler(async (req: Request, res: Response) => {
    const theme = await MenuThemeService.getThemeBySlug(req.params.slug as string);
    if (!theme) {
      throw new ApiError(404, 'Theme not found');
    }
    res.status(200).json(new ApiResponse(200, theme, 'Theme fetched successfully'));
  }),

  updateTheme: asyncHandler(async (req: Request, res: Response) => {
    const theme = await MenuThemeService.updateTheme(req.params.id as string, req.body);
    res.status(200).json(new ApiResponse(200, theme, 'Theme updated successfully'));
  }),

  deleteTheme: asyncHandler(async (req: Request, res: Response) => {
    await MenuThemeService.deleteTheme(req.params.id as string);
    res.status(200).json(new ApiResponse(200, null, 'Theme deleted successfully'));
  })
};
