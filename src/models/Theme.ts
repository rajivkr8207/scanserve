import mongoose, { Document, Model, Schema, Types } from 'mongoose'

export type ThemeName = 'chai' | 'burger' | 'fine_dine' | 'default'

export interface IThemeColors {
  primary: string
  secondary: string
  background: string
  text: string
  accent?: string
}

export interface IThemeFonts {
  heading: string
  body: string
}

export interface ITheme extends Document {
  restaurantId: Types.ObjectId
  themeName: ThemeName
  colors: IThemeColors
  fonts: IThemeFonts
  layout: string
  createdAt: Date
  updatedAt: Date
}

const ThemeSchema = new Schema<ITheme>(
  {
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
      unique: true, // one theme per restaurant
      index: true,
    },
    themeName: {
      type: String,
      enum: ['chai', 'burger', 'fine_dine', 'default'],
      default: 'default',
    },
    colors: {
      primary:    { type: String, default: '#f97316' },
      secondary:  { type: String, default: '#ea580c' },
      background: { type: String, default: '#ffffff' },
      text:       { type: String, default: '#111827' },
      accent:     { type: String },
    },
    fonts: {
      heading: { type: String, default: 'Inter' },
      body:    { type: String, default: 'Inter' },
    },
    layout: { type: String, default: 'grid' },
  },
  { timestamps: true }
)

const Theme: Model<ITheme> =
  mongoose.models.Theme ?? mongoose.model<ITheme>('Theme', ThemeSchema)

export default Theme
