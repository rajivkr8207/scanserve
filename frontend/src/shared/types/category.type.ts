export interface IMenuCategory {
  _id: string;
  restaurant: string;
  seller: string;
  name: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}
