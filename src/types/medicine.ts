export interface Medicine {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: string | number;
  stock: number;
  manufacturer: string;
  imageUrl?: string;
  isFeatured: boolean;
  dosageForm?: string;
  categoryId: string;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
}
