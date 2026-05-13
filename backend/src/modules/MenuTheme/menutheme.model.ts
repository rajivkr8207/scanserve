import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMenuTheme extends Document {
  name: string;
  slug: string;
  description: string;
  previewImage: string;
  templateType: 'card' | 'list' | 'category';
  version: string;
  isPremium: boolean;
  isActive: boolean;
  branding: {
    restaurantName: string;
    logo: string;
    coverImage: string;
    favicon: string;
    tagline: string;
  };
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    cardBackground: string;
    textPrimary: string;
    textSecondary: string;
    border: string;
    accent: string;
    success: string;
    danger: string;
    buttonColor: string;
    buttonTextColor: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    headingSize: number;
    bodySize: number;
    fontWeight: string;
    lineHeight: number;
  };
  layout: {
    templateStyle: 'grid' | 'list' | 'cards';
    categoryStyle: 'sidebar' | 'tabs' | 'accordion';
    itemCardStyle: 'glass' | 'minimal' | 'solid';
    itemImagePosition: 'top' | 'left' | 'background';
    borderRadius: number;
    spacing: number;
    containerWidth: string;
    stickyCategoryBar: boolean;
  };
  visibility: {
    showSearch: boolean;
    showCategory: boolean;
    showDescription: boolean;
    showRatings: boolean;
    showVegBadge: boolean;
    showPrice: boolean;
    showAddToCart: boolean;
    showPreparationTime: boolean;
    showOfferBadge: boolean;
    showRecommendedTag: boolean;
  };
  categoryConfig: {
    shape: 'pill' | 'square' | 'rounded';
    activeColor: string;
    inactiveColor: string;
    iconVisible: boolean;
  };
  itemCard: {
    imageRatio: string;
    shadow: boolean;
    borderWidth: number;
    hoverScale: number;
    showImage: boolean;
  };
  buttons: {
    addToCartText: string;
    borderRadius: number;
    size: 'small' | 'medium' | 'large';
  };
  spacingConfig: {
    sectionGap: number;
    cardPadding: number;
    itemGap: number;
  };
  mobile: {
    columns: number;
    compactMode: boolean;
    stickyCartButton: boolean;
  };
  effects: {
    hoverEffect: 'none' | 'zoom' | 'liquid' | '3d-tilt';
    cardAnimation: 'none' | 'float' | 'scale';
    pageAnimation: 'none' | 'fade' | 'slide';
    glassmorphism: boolean;
    blurEffects: boolean;
    gradientBackground: boolean;
  };
  customCss: string;
  presetTags: string[];
  createdBy: Types.ObjectId | null;
}

const MenuThemeSchema = new Schema<IMenuTheme>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: "" },
    previewImage: { type: String, default: "" },
    templateType: { type: String, enum: ["card", "list", "category"], default: "card" },
    version: { type: String, default: "1.0.0" },
    isPremium: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    branding: {
      restaurantName: { type: String, default: "" },
      logo: { type: String, default: "" },
      coverImage: { type: String, default: "" },
      favicon: { type: String, default: "" },
      tagline: { type: String, default: "" },
    },
    colors: {
      primary: { type: String, default: "#ff6600" },
      secondary: { type: String, default: "#ffffff" },
      background: { type: String, default: "#0f172a" },
      surface: { type: String, default: "#111827" },
      cardBackground: { type: String, default: "#1f2937" },
      textPrimary: { type: String, default: "#ffffff" },
      textSecondary: { type: String, default: "#9ca3af" },
      border: { type: String, default: "#374151" },
      accent: { type: String, default: "#22c55e" },
      success: { type: String, default: "#16a34a" },
      danger: { type: String, default: "#dc2626" },
      buttonColor: { type: String, default: "#ff6600" },
      buttonTextColor: { type: String, default: "#ffffff" },
    },
    typography: {
      headingFont: { type: String, default: "Poppins" },
      bodyFont: { type: String, default: "Inter" },
      headingSize: { type: Number, default: 32 },
      bodySize: { type: Number, default: 16 },
      fontWeight: { type: String, default: "400" },
      lineHeight: { type: Number, default: 1.5 },
    },
    layout: {
      templateStyle: { type: String, enum: ["grid", "list", "cards"], default: "cards" },
      categoryStyle: { type: String, enum: ["sidebar", "tabs", "accordion"], default: "tabs" },
      itemCardStyle: { type: String, enum: ["glass", "minimal", "solid"], default: "glass" },
      itemImagePosition: { type: String, enum: ["top", "left", "background"], default: "top" },
      borderRadius: { type: Number, default: 20 },
      spacing: { type: Number, default: 16 },
      containerWidth: { type: String, default: "1400px" },
      stickyCategoryBar: { type: Boolean, default: true },
    },
    visibility: {
      showSearch: { type: Boolean, default: true },
      showCategory: { type: Boolean, default: true },
      showDescription: { type: Boolean, default: true },
      showRatings: { type: Boolean, default: true },
      showVegBadge: { type: Boolean, default: true },
      showPrice: { type: Boolean, default: true },
      showAddToCart: { type: Boolean, default: true },
      showPreparationTime: { type: Boolean, default: true },
      showOfferBadge: { type: Boolean, default: true },
      showRecommendedTag: { type: Boolean, default: true },
    },
    categoryConfig: {
      shape: { type: String, enum: ["pill", "square", "rounded"], default: "pill" },
      activeColor: { type: String, default: "#ff6600" },
      inactiveColor: { type: String, default: "#374151" },
      iconVisible: { type: Boolean, default: true },
    },
    itemCard: {
      imageRatio: { type: String, default: "1/1" },
      shadow: { type: Boolean, default: true },
      borderWidth: { type: Number, default: 1 },
      hoverScale: { type: Number, default: 1.05 },
      showImage: { type: Boolean, default: true },
    },
    buttons: {
      addToCartText: { type: String, default: "Add" },
      borderRadius: { type: Number, default: 12 },
      size: { type: String, enum: ["small", "medium", "large"], default: "medium" },
    },
    spacingConfig: {
      sectionGap: { type: Number, default: 32 },
      cardPadding: { type: Number, default: 16 },
      itemGap: { type: Number, default: 16 },
    },
    mobile: {
      columns: { type: Number, default: 1 },
      compactMode: { type: Boolean, default: false },
      stickyCartButton: { type: Boolean, default: true },
    },
    effects: {
      hoverEffect: { type: String, enum: ["none", "zoom", "liquid", "3d-tilt"], default: "zoom" },
      cardAnimation: { type: String, enum: ["none", "float", "scale"], default: "scale" },
      pageAnimation: { type: String, enum: ["none", "fade", "slide"], default: "fade" },
      glassmorphism: { type: Boolean, default: false },
      blurEffects: { type: Boolean, default: false },
      gradientBackground: { type: Boolean, default: false },
    },
    customCss: { type: String, default: "" },
    presetTags: [{ type: String }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

export const MenuTheme = mongoose.model<IMenuTheme>("MenuTheme", MenuThemeSchema);