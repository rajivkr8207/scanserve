import mongoose, { Document, Model, Schema, Types } from 'mongoose'

export type PaymentState = 'CREATED' | 'PAID' | 'FAILED' | 'REFUNDED'

export interface IPayment extends Document {
  orderId: Types.ObjectId
  razorpayOrderId: string
  razorpayPaymentId?: string
  razorpaySignature?: string
  amount: number
  currency: string
  status: PaymentState
  createdAt: Date
  updatedAt: Date
}

const PaymentSchema = new Schema<IPayment>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      index: true,
    },
    razorpayOrderId:  { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    amount:   { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: {
      type: String,
      enum: ['CREATED', 'PAID', 'FAILED', 'REFUNDED'],
      default: 'CREATED',
    },
  },
  { timestamps: true }
)

PaymentSchema.index({ razorpayOrderId: 1 })

const Payment: Model<IPayment> =
  mongoose.models.Payment ?? mongoose.model<IPayment>('Payment', PaymentSchema)

export default Payment
