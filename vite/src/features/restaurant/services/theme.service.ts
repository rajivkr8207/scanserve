import { api } from '../../../lib/api';

export interface MenuTheme {
  _id?: string;
  name?: string;
  slug?: string;
  description?: string;
  previewImage?: string;
  templateType?: 'card' | 'list' | 'category';
  version?: string;
  isPremium?: boolean;
  isActive?: boolean;
  branding?: {
    restaurantName?: string;
    logo?: string;
    coverImage?: string;
    favicon?: string;
    tagline?: string;
  };
  colors?: {
    primary?: string;
    secondary?: string;
    background?: string;
    surface?: string;
    cardBackground?: string;
    textPrimary?: string;
    textSecondary?: string;
    border?: string;
    accent?: string;
    success?: string;
    danger?: string;
    buttonColor?: string;
    buttonTextColor?: string;
  };
  typography?: {
    headingFont?: string;
    bodyFont?: string;
    headingSize?: number;
    bodySize?: number;
    fontWeight?: string;
    lineHeight?: number;
  };
  layout?: {
    templateStyle?: 'grid' | 'list' | 'cards';
    categoryStyle?: 'sidebar' | 'tabs' | 'accordion';
    itemCardStyle?: 'glass' | 'minimal' | 'solid';
    itemImagePosition?: 'top' | 'left' | 'background';
    borderRadius?: number;
    spacing?: number;
    containerWidth?: string;
    stickyCategoryBar?: boolean;
  };
  visibility?: {
    showSearch?: boolean;
    showCategory?: boolean;
    showDescription?: boolean;
    showRatings?: boolean;
    showVegBadge?: boolean;
    showPrice?: boolean;
    showAddToCart?: boolean;
    showPreparationTime?: boolean;
    showOfferBadge?: boolean;
    showRecommendedTag?: boolean;
  };
  categoryConfig?: {
    shape?: 'pill' | 'square' | 'rounded';
    activeColor?: string;
    inactiveColor?: string;
    iconVisible?: boolean;
  };
  itemCard?: {
    imageRatio?: string;
    shadow?: boolean;
    borderWidth?: number;
    hoverScale?: number;
    showImage?: boolean;
  };
  buttons?: {
    addToCartText?: string;
    borderRadius?: number;
    size?: 'small' | 'medium' | 'large';
  };
  spacingConfig?: {
    sectionGap?: number;
    cardPadding?: number;
    itemGap?: number;
  };
  mobile?: {
    columns?: number;
    compactMode?: boolean;
    stickyCartButton?: boolean;
  };
  effects?: {
    hoverEffect?: 'none' | 'zoom' | 'liquid' | '3d-tilt';
    cardAnimation?: 'none' | 'float' | 'scale';
    pageAnimation?: 'none' | 'fade' | 'slide';
    glassmorphism?: boolean;
    blurEffects?: boolean;
    gradientBackground?: boolean;
  };
  customCss?: string;
  presetTags?: string[];
  [key: string]: any;
}

export const ThemeServices = {
    getMyTheme: async () => {
        return api.get('/themes/mine');
    },
    
    getThemeBySlug: async (slug: string) => {
        return api.get(`/themes/restaurant/slug/${slug}`);
    },

    createTheme: async (data: MenuTheme) => {
        return api.post('/themes', data);
    },

    updateTheme: async (id: string, data: MenuTheme) => {
        return api.put(`/themes/${id}`, data);
    }
};
