import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { CategoryService } from './category.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await CategoryService.createCategory(req.user.id, req.body);
  return res.status(201).json(new ApiResponse(201, category, 'Category created successfully'));
});

export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await CategoryService.getAllCategories(req.user.id);
  return res.status(200).json(new ApiResponse(200, categories, 'Categories fetched successfully'));
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await CategoryService.updateCategory(
    req.params.id as string,
    req.user.id,
    req.body,
  );
  return res.status(200).json(new ApiResponse(200, category, 'Category updated successfully'));
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  await CategoryService.deleteCategory(req.params.id as string, req.user.id);
  return res.status(200).json(new ApiResponse(200, {}, 'Category deleted successfully'));
});
