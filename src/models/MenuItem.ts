import mongoose, { Document, Model, Schema, Types } from 'mongoose'

export interface IMenuItem extends Document {
  restaurantId: Types.ObjectId
  userId: string
  name: string
  description?: string
  price: number
  category: string
  image?: string
  isAvailable: boolean
  createdAt: Date
  updatedAt: Date
}

const MenuItemSchema = new Schema<IMenuItem>(
  {
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    description: { type: String, trim: true },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    image: { type: String, default: '' },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
)

MenuItemSchema.index({ restaurantId: 1, category: 1 })
MenuItemSchema.index({ restaurantId: 1, isAvailable: 1 })

const MenuItem: Model<IMenuItem> =
  mongoose.models.MenuItem ?? mongoose.model<IMenuItem>('MenuItem', MenuItemSchema)

export default MenuItem
