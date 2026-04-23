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
  openingHours: {
    day: string;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
