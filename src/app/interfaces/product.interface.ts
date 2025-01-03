export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  type: 'home' | 'pro' | 'enterprise' | 'proplus' | 'home&bussiness';
  imageUrl: string;
} 