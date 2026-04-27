import mongoose, { Schema, Document, Types } from 'mongoose';
import type { IRestaurant as ISharedRestaurant } from '../../../../shared/types/restaurant.type.js';

export interface IRestaurant
  extends Document, Omit<ISharedRestaurant, '_id' | 'seller' | 'createdAt' | 'updatedAt'> {
  seller: Types.ObjectId;
}

const restaurantSchema = new Schema<IRestaurant>(
  {
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
    },

    description: String,

    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: 'India' },
    },
    contact: {
      phone: { type: String, required: true },
      email: String,
    },

    logo: String,
    coverImage: String,

    cuisineTypes: [String],

    isActive: {
      type: Boolean,
      default: true,
    },

    isOpen: {
      type: Boolean,
      default: false,
    },
    menuTemplate: {
      type: String,
      enum: ['MODERN', 'CLASSIC', 'MINIMAL', 'VIBRANT'],
      default: 'MODERN',
    },
    openingHours: [
      {
        day: {
          type: String,
          enum: [
            'All Day',
            'Monday to Saturday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
          default: 'All Day',
        },
        openTime: String,
        closeTime: String,
        isClosed: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true },
);

export const Restaurant = mongoose.model<IRestaurant>('Restaurant', restaurantSchema);
