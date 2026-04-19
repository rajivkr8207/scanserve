import mongoose, { Document, Model, Schema, Types } from 'mongoose'

export interface IWorkingHourSlot {
  open: string  // "09:00"
  close: string // "22:00"
  isOpen: boolean
}

export type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

export type IWorkingHours = Record<WeekDay, IWorkingHourSlot>

export interface ITemporaryClosure {
  isActive: boolean
  reason?: string
  until?: Date
}

export interface IOrderSettings {
  codEnabled: boolean
  codMaxAmount: number
  prepaidOnly: boolean
}

export interface IStoreStatus {
  manualMode: 'ONLINE' | 'OFFLINE'
}

export interface IRestaurant extends Document {
  ownerId: Types.ObjectId
  name: string
  slug: string
  address: string
  logo?: string
  theme?: string
  storeStatus: IStoreStatus
  workingHours: IWorkingHours
  temporaryClosure: ITemporaryClosure
  orderSettings: IOrderSettings
  createdAt: Date
  updatedAt: Date
}

const WorkingHourSlotSchema = new Schema<IWorkingHourSlot>(
  {
    open: { type: String, default: '09:00' },
    close: { type: String, default: '22:00' },
    isOpen: { type: Boolean, default: true },
  },
  { _id: false }
)

const defaultWorkingHours = (): IWorkingHours => ({
  monday:    { open: '09:00', close: '22:00', isOpen: true },
  tuesday:   { open: '09:00', close: '22:00', isOpen: true },
  wednesday: { open: '09:00', close: '22:00', isOpen: true },
  thursday:  { open: '09:00', close: '22:00', isOpen: true },
  friday:    { open: '09:00', close: '22:00', isOpen: true },
  saturday:  { open: '10:00', close: '23:00', isOpen: true },
  sunday:    { open: '10:00', close: '22:00', isOpen: false },
})

const RestaurantSchema = new Schema<IRestaurant>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Restaurant name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    address: { type: String, default: '' },
    logo: { type: String, default: '' },
    theme: { type: String, default: 'default' },
    storeStatus: {
      manualMode: {
        type: String,
        enum: ['ONLINE', 'OFFLINE'],
        default: 'ONLINE',
      },
    },
    workingHours: {
      monday:    { type: WorkingHourSlotSchema, default: () => defaultWorkingHours().monday },
      tuesday:   { type: WorkingHourSlotSchema, default: () => defaultWorkingHours().tuesday },
      wednesday: { type: WorkingHourSlotSchema, default: () => defaultWorkingHours().wednesday },
      thursday:  { type: WorkingHourSlotSchema, default: () => defaultWorkingHours().thursday },
      friday:    { type: WorkingHourSlotSchema, default: () => defaultWorkingHours().friday },
      saturday:  { type: WorkingHourSlotSchema, default: () => defaultWorkingHours().saturday },
      sunday:    { type: WorkingHourSlotSchema, default: () => defaultWorkingHours().sunday },
    },
    temporaryClosure: {
      isActive: { type: Boolean, default: false },
      reason: { type: String },
      until: { type: Date },
    },
    orderSettings: {
      codEnabled:   { type: Boolean, default: true },
      codMaxAmount: { type: Number, default: 500 },
      prepaidOnly:  { type: Boolean, default: false },
    },
  },
  { timestamps: true }
)

const Restaurant: Model<IRestaurant> =
  mongoose.models.Restaurant ?? mongoose.model<IRestaurant>('Restaurant', RestaurantSchema)

export default Restaurant
