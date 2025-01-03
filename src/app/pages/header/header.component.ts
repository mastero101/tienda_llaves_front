import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../interfaces/cart-item.interface';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  cartItemCount = 0;
  cartItems: CartItem[] = [];
  isCartOpen = false;
  total = 0;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
      this.total = this.cartService.getTotal();
    });
  }

  toggleCart() {
    this.isCartOpen = !this.isCartOpen;
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity > 0) {
      this.cartService.updateQuantity(productId, quantity);
    }
  }
}