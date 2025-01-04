export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  type: 'home' |
        'pro' | 
        'enterprise' | 
        'proplus' | 
        'home&bussiness' |
        'office365' |
        'antivirus' | 
        'account' |
        'autodesk' 
        ;
  imageUrl: string;
} 