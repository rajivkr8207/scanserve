export interface IMenuItem {
  _id: string;
  restaurant: string;
  category: string;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  image?: string;
  isVeg: boolean;
  isAvailable: boolean;
  preparationTime: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
