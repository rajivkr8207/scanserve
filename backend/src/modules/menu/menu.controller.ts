import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { MenuService } from './menu.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

export const createMenuItem = asyncHandler(async (req: Request, res: Response) => {
  const menuItem = await MenuService.createMenuItem(req.user.id, req.body);
  return res.status(201).json(new ApiResponse(201, menuItem, 'Menu item created successfully'));
});

export const getMenuItems = asyncHandler(async (req: Request, res: Response) => {
  const menuItems = await MenuService.getAllMenuItems(req.user.id);
  return res.status(200).json(new ApiResponse(200, menuItems, 'Menu items fetched successfully'));
});

export const updateMenuItem = asyncHandler(async (req: Request, res: Response) => {
  const menuItem = await MenuService.updateMenuItem(req.params.id as string, req.user.id, req.body);
  return res.status(200).json(new ApiResponse(200, menuItem, 'Menu item updated successfully'));
});

export const deleteMenuItem = asyncHandler(async (req: Request, res: Response) => {
  await MenuService.deleteMenuItem(req.params.id as string, req.user.id);
  return res.status(200).json(new ApiResponse(200, {}, 'Menu item deleted successfully'));
});

export const toggleAvailability = asyncHandler(async (req: Request, res: Response) => {
  const menuItem = await MenuService.toggleAvailability(
    req.params.id as string,
    req.user.id,
    req.body.isAvailable,
  );
  return res.status(200).json(new ApiResponse(200, menuItem, 'Availability updated successfully'));
});

export const getPublicMenuBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const menu = await MenuService.getPublicMenuBySlug(slug);
  return res.status(200).json(new ApiResponse(200, menu, 'Menu fetched successfully'));
});
