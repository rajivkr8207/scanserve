import { MenuTheme, type IMenuTheme } from './menutheme.model.js';
import { ApiError } from '../../utils/ApiError.js';

export const MenuThemeService = {
  async createTheme(data: Partial<IMenuTheme>, adminId: string) {
    const theme = await MenuTheme.create({
      ...data,
      createdBy: adminId
    });
    return theme;
  },

  async getAllThemes(filter: any = {}) {
    return await MenuTheme.find(filter).sort({ createdAt: -1 });
  },

  async getThemeById(id: string) {
    const theme = await MenuTheme.findById(id);
    if (!theme) throw new ApiError(404, 'Theme not found');
    return theme;
  },

  async getThemeBySlug(slug: string) {
    const theme = await MenuTheme.findOne({ slug, isActive: true });
    if (!theme) throw new ApiError(404, 'Theme not found');
    return theme;
  },

  async updateTheme(id: string, data: Partial<IMenuTheme>) {
    const theme = await MenuTheme.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!theme) throw new ApiError(404, 'Theme not found');
    return theme;
  },

  async deleteTheme(id: string) {
    const theme = await MenuTheme.findByIdAndDelete(id);
    if (!theme) throw new ApiError(404, 'Theme not found');
    return theme;
  },

  async getThemeBySeller(sellerId: string) {
    let theme = await MenuTheme.findOne({ createdBy: sellerId });
    if (!theme) {
      // Create a default theme for the seller
      theme = await MenuTheme.create({
        name: 'Default Theme',
        slug: `theme-${sellerId}`,
        createdBy: sellerId,
        branding: {
          restaurantName: 'My Restaurant',
          tagline: 'Authentic Culinary Experience',
        }
      });
    }
    return theme;
  },

  async getThemeByRestaurantId(restaurantId: string) {
    if (!restaurantId || restaurantId === 'undefined') {
      throw new ApiError(400, 'Valid Restaurant ID is required');
    }
    
    const { Restaurant } = await import('../resturant/restaurant.model.js');
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) throw new ApiError(404, 'Restaurant not found');
    
    return await MenuThemeService.getThemeBySeller(restaurant.seller.toString());
  },

  async getThemeByRestaurantSlug(slug: string) {
    if (!slug || slug === 'undefined') {
      throw new ApiError(400, 'Valid Restaurant slug is required');
    }

    const { Restaurant } = await import('../resturant/restaurant.model.js');
    const restaurant = await Restaurant.findOne({ slug });
    if (!restaurant) throw new ApiError(404, 'Restaurant not found');
    
    return await MenuThemeService.getThemeBySeller(restaurant.seller.toString());
  }
};
