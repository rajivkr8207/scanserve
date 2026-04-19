import mongoose, { Document, Model, Schema, Types } from 'mongoose'

export interface ITable extends Document {
  restaurantId: Types.ObjectId
  tableNumber: number
  qrCodeUrl: string
  createdAt: Date
}

const TableSchema = new Schema<ITable>(
  {
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    tableNumber: {
      type: Number,
      required: [true, 'Table number is required'],
      min: [1, 'Table number must be at least 1'],
    },
    qrCodeUrl: { type: String, default: '' },
  },
  { timestamps: true }
)

// Composite unique: one tableNumber per restaurant
TableSchema.index({ restaurantId: 1, tableNumber: 1 }, { unique: true })

const Table: Model<ITable> =
  mongoose.models.Table ?? mongoose.model<ITable>('Table', TableSchema)

export default Table
