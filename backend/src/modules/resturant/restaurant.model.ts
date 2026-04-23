import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IRestaurant extends Document {
  seller: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  contact: {
    phone: string;
    email?: string;
  };
  logo?: string;
  coverImage?: string;
  cuisineTypes: string[];
  isActive: boolean;
  isOpen: boolean;
  openingHours: {
    day: string;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
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
