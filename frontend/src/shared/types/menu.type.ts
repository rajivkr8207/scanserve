import { IMenuCategory } from './category.type';

export interface IMenuItem {
  _id: string;
  restaurant: string;
  category: string | IMenuCategory;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  image?: string;
  isVeg: boolean;
  isAvailable: boolean;
  isBestseller?: boolean;
  preparationTime: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
