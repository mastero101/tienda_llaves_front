import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    {
        id: 1,
        name: 'Windows 11 Home',
        description: 'Licencia digital para Windows 11 Home',
        price: 119.99,
        type: 'home',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxv7_o77kBDjqcfOaTNN9Jt-tkQABGUCSxPw&s', 
    },
    {
      id: 2,
      name: 'Windows 11 Pro',
      description: 'Licencia digital para Windows 11 Pro',
      price: 119.99,
      type: 'pro',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQc2G_IfOm6KwsiXUb7cfYXqLyDdi9nQuxapg&s',
    },
    {
      id: 3,
      name: 'Windows 10 Pro',
      description: 'Licencia digital para Windows 10 Pro',
      price: 119.99,
      type: 'pro',
      imageUrl: 'https://3clics.mx/images/stories/virtuemart/product/licencia-windows-10.jpg',
    },
    {
      id: 4,
      name: 'Windows 10 Home',
      description: 'Licencia digital para Windows 10 Home',
      price: 119.99,
      type: 'home',
      imageUrl: 'https://cdnx.jumpseller.com/keyxpress-mexico1/image/30735061/Windows_10_Home.png?1704147323',
    },
    {
      id: 5,
      name: 'Office Pro Plus 19 Telefonica',
      description: 'Licencia digital para Office Pro Plus 19 Telefonica',
      price: 80.99,
      type: 'proplus',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOOejoH0zG10Iu-FnQXaakbYv5oMM-iq0mmQ&s',
    },
    {
      id: 6,
      name: 'Office 21 Pro Plus Telefonica',
      description: 'Licencia digital para Office 21 Pro Plus Telefonica',
      price: 80.99,
      type: 'proplus',
      imageUrl: 'https://dharmacorpstore.com/wp-content/uploads/2023/03/office_2021_professional_plus_800x.jpg',
    },
    {
      id: 7,
      name: 'Office 21 Home and Business MAC',
      description: 'Licencia digital para Office 21 Home and Business MAC',
      price: 799.99,
      type: 'home&bussiness',
      imageUrl: 'https://softwaredepot.co/cdn/shop/files/microsoft-microsoft-office-2021-home-business-mac-33718832758973_1280x.png?v=1700460079',
    },
  ];

  getProducts() {
    return this.products;
  }

  getProductById(id: number) {
    return this.products.find(product => product.id === id);
  }
} 