import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../interfaces/cart-item.interface';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})

export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  total: number = 0;
  
  // Datos del formulario
  customerInfo = {
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    zipCode: '',
    paymentMethod: 'card'
  };

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getTotal();

      if (this.cartItems.length === 0) {
        this.router.navigate(['/productos']);
      }
    });
  }

  onSubmit() {
    // Aquí iría la lógica de procesamiento del pago
    console.log('Información del cliente:', this.customerInfo);
    console.log('Items del carrito:', this.cartItems);
    console.log('Total:', this.total);
    
    // Limpiar carrito y redirigir a confirmación
    this.cartService.clearCart();
    this.router.navigate(['/confirmacion']);
  }
}
