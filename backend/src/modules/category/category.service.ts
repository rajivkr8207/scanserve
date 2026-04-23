import { MenuCategory } from './category.model.js';
import { Restaurant } from '../resturant/restaurant.model.js';
import { ApiError } from '../../utils/ApiError.js';

export const CategoryService = {
  async createCategory(sellerId: string, data: any) {
    const restaurant = await Restaurant.findOne({ seller: sellerId });
    if (!restaurant) {
      throw new ApiError(404, 'Restaurant not found for this seller');
    }

    const category = await MenuCategory.create({
      ...data,
      restaurant: restaurant._id,
      seller: sellerId,
    });
    return category;
  },

  async getAllCategories(sellerId: string) {
    const restaurant = await Restaurant.findOne({ seller: sellerId });
    if (!restaurant) {
      throw new ApiError(404, 'Restaurant not found');
    }
    return await MenuCategory.find({ restaurant: restaurant._id }).sort({ sortOrder: 1 });
  },

  async updateCategory(categoryId: string, sellerId: string, data: any) {
    const category = await MenuCategory.findOneAndUpdate(
      { _id: categoryId, seller: sellerId },
      { $set: data },
      { new: true, runValidators: true },
    );
    if (!category) {
      throw new ApiError(404, 'Category not found or you are not authorized');
    }
    return category;
  },

  async deleteCategory(categoryId: string, sellerId: string) {
    const category = await MenuCategory.findOneAndDelete({ _id: categoryId, seller: sellerId });
    if (!category) {
      throw new ApiError(404, 'Category not found or you are not authorized');
    }
    return category;
  },
};
