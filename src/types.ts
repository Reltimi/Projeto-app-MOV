export type ProductCategory = 'vegetais' | 'frutas' | 'graos' | 'despensa';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
  unit: string;
  quantity: number; // available stock
  image: string;
  rating: number;
  reviewsCount: number;
  isOrganic?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  tag?: string; // e.g., 'Sazonal', 'Novidade', 'Oferta'
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type UserRole = 'buyer' | 'seller';

export type ActiveScreen = 'onboarding' | 'marketplace' | 'checkout' | 'producer' | 'mvp' | 'admin';

export interface UserStory {
  id: string;
  title: string;
  description: string;
  gravity: number;
  urgency: number;
  trend: number;
  total: number;
  priority: string;
}
