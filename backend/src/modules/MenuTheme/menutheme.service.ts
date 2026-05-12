import { MenuTheme, type IMenuTheme } from './menutheme.js';
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
  }
};
