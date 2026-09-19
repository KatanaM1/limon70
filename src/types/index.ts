export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  oldPrice?: number;
  category?: string;
  sizes: string[];
  photos: string[];
  inStock: boolean;
  createdAt: number;
};

export type ProductInput = Omit<Product, 'id' | 'createdAt'>;