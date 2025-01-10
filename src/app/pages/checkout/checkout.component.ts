import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { MercadoPagoService } from '../../services/mercado-pago.service';
import { CartItem } from '../../interfaces/cart-item.interface';
import { Subscription } from 'rxjs';
import { PaymentSelectorComponent } from './payment-selector/payment-selector.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, PaymentSelectorComponent], // Agregar a imports
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
    paymentMethod: '' // Ya no inicializamos con 'mercadopago'
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
      }
    });
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  // Nuevo método para manejar el evento del selector de pagos
  handlePaymentSubmit(event: {method: string, data: any}) {
    this.customerInfo.paymentMethod = event.method;
    
    if (this.validateForm()) {
      try {
        if (event.method === 'transfer') {
          // Procesar la transferencia
          console.log('Procesando transferencia bancaria');
        }
        // No necesitamos manejar el caso de 'card' aquí porque
        // MercadoPago se encarga de eso en su propio formulario
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