import mongoose, { Document, Model, Schema, Types } from 'mongoose'

export type OrderStatus = 'PENDING' | 'PREPARING' | 'SERVED' | 'CANCELLED'
export type PaymentMethod = 'COD' | 'ONLINE'
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED'

export interface IOrderItem {
  itemId: Types.ObjectId
  name: string
  qty: number
  price: number
}

export interface ICustomer {
  name: string
  phone: string
  email?: string
}

export interface IRiskMeta {
  ip?: string
  deviceId?: string
  userAgent?: string
}

export interface IOrder extends Document {
  restaurantId: Types.ObjectId
  tableId: Types.ObjectId
  items: IOrderItem[]
  totalAmount: number
  status: OrderStatus
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  customer: ICustomer
  riskMeta: IRiskMeta
  createdAt: Date
  updatedAt: Date
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    itemId: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    name:   { type: String, required: true },
    qty:    { type: Number, required: true, min: 1 },
    price:  { type: Number, required: true, min: 0 },
  },
  { _id: false }
)

const OrderSchema = new Schema<IOrder>(
  {
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
      index: true,
    },
    tableId: {
      type: Schema.Types.ObjectId,
      ref: 'Table',
      required: true,
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: (v: IOrderItem[]) => v.length > 0,
        message: 'Order must contain at least one item',
      },
    },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['PENDING', 'PREPARING', 'SERVED', 'CANCELLED'],
      default: 'PENDING',
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'ONLINE'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED'],
      default: 'PENDING',
    },
    customer: {
      name:  { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      email: { type: String, trim: true, lowercase: true },
    },
    riskMeta: {
      ip:        { type: String },
      deviceId:  { type: String },
      userAgent: { type: String },
    },
  },
  { timestamps: true }
)

OrderSchema.index({ restaurantId: 1, status: 1 })
OrderSchema.index({ restaurantId: 1, createdAt: -1 })

const Order: Model<IOrder> =
  mongoose.models.Order ?? mongoose.model<IOrder>('Order', OrderSchema)

export default Order
