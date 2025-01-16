import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../interfaces/cart-item.interface';
import { Product } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      // Solo ejecutar en el navegador
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        this.cartItems.next(JSON.parse(savedCart));
      }
    }
  }

  addToCart(product: Product, quantity: number = 1) {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
      this.cartItems.next([...currentItems]);
    } else {
      this.cartItems.next([...currentItems, { product, quantity }]);
    }
    this.saveCart();
  }

  removeFromCart(productId: number) {
    const currentItems = this.cartItems.value;
    const updatedItems = currentItems.filter(item => item.product.id !== productId);
    this.cartItems.next(updatedItems);
    this.saveCart();
  }

  updateQuantity(productId: number, quantity: number) {
    const currentItems = this.cartItems.value;
    const item = currentItems.find(item => item.product.id === productId);
    if (item) {
      item.quantity = quantity;
      this.cartItems.next([...currentItems]);
      this.saveCart();
    }
  }

  clearCart() {
    this.cartItems.next([]);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('cart');
    }
  }

  private saveCart() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cart', JSON.stringify(this.cartItems.value));
    }
  }

  getTotal(): number {
    return this.cartItems.value.reduce((total, item) => 
      total + (item.product.price * item.quantity), 0);
  }
} 