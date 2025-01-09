import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { MercadoPagoService } from '../../services/mercado-pago.service';
import { CartItem } from '../../interfaces/cart-item.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  total: number = 0;
  private cartSubscription?: Subscription;

  customerInfo = {
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    country: 'AR',
    zipCode: '',
    paymentMethod: 'mercadopago'
  };

  constructor(
    private cartService: CartService,
    private mercadoPagoService: MercadoPagoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartSubscription = this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getTotal();

      if (this.cartItems.length === 0) {
        this.router.navigate(['/productos']);
        return;
      }

      this.initializePayment();
    });
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  async initializePayment() {
    try {
      await this.mercadoPagoService.initCardPayment(this.total);
    } catch (error) {
      console.error('Error al inicializar el pago:', error);
    }
  }

  async pay() {
    if (this.validateForm()) {
      try {
        // Inicializar el pago con MercadoPago
        const items = this.cartItems.map(item => ({
          title: item.product.name,
          unit_price: item.product.price,
          quantity: item.quantity
        }));

        await this.mercadoPagoService.initCardPayment(this.total);
      } catch (error) {
        console.error('Error al procesar el pago:', error);
      }
    } else {
      alert('Por favor, complete todos los campos requeridos.');
    }
  }

  onSubmit() {
    if (this.validateForm()) {
      console.log('Información del cliente:', this.customerInfo);
      console.log('Items del carrito:', this.cartItems);
      console.log('Total:', this.total);
    }
  }

  private validateForm(): boolean {
    return !!(
      this.customerInfo.email &&
      this.customerInfo.firstName &&
      this.customerInfo.lastName &&
      this.customerInfo.phone &&
      this.customerInfo.address &&
      this.customerInfo.city &&
      this.customerInfo.zipCode
    );
  }
}
