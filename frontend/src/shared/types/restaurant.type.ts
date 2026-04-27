export enum MenuTemplate {
  MODERN = 'MODERN',
  CLASSIC = 'CLASSIC',
  MINIMAL = 'MINIMAL',
  VIBRANT = 'VIBRANT',
}

export interface IRestaurant {
  _id: string;
  seller: string;
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
  menuTemplate: MenuTemplate;
  openingHours: {
    day: string;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
