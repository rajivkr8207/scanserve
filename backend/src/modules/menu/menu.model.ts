import mongoose, { Schema, Document, Types } from 'mongoose';
import type { IMenuItem as ISharedMenuItem } from '../../../../shared/types/menu.type.js';

export interface IMenuItem
  extends
    Document,
    Omit<ISharedMenuItem, '_id' | 'restaurant' | 'category' | 'createdAt' | 'updatedAt'> {
  restaurant: Types.ObjectId;
  category: Types.ObjectId;
}

const menuItemSchema = new Schema<IMenuItem>(
  {
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: 'MenuCategory',
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    description: String,

    price: {
      type: Number,
      required: true,
    },

    discountPrice: Number,

    image: String,

    isVeg: {
      type: Boolean,
      default: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    preparationTime: {
      type: Number,
      default: 15,
    },

    tags: [String],
  },
  { timestamps: true },
);

export const MenuItem = mongoose.model<IMenuItem>('MenuItem', menuItemSchema);
