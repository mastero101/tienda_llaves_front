export interface Product {
  id: number;
  name: string;
  description: string;
  installationInstructions: string[];
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