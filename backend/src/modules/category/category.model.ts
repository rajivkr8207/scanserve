import mongoose, { Schema, Document, Types } from 'mongoose';
import type { IMenuCategory as ISharedCategory } from '../../../../shared/types/category.type.js';

export interface IMenuCategory
  extends
    Document,
    Omit<ISharedCategory, '_id' | 'restaurant' | 'seller' | 'createdAt' | 'updatedAt'> {
  restaurant: Types.ObjectId;
  seller: Types.ObjectId;
}

const menuCategorySchema = new Schema<IMenuCategory>(
  {
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'Seller',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export const MenuCategory = mongoose.model<IMenuCategory>('MenuCategory', menuCategorySchema);
