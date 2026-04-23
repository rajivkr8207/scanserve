import mongoose, { Schema, Document, Types } from 'mongoose';
export interface IMenuCategory extends Document {
  restaurant: Types.ObjectId;
  seller: Types.ObjectId;
  name: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
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
