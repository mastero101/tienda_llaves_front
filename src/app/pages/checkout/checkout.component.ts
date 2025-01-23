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
export class CheckoutComponent implements OnInit {
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
    });
  }


  // Nuevo método para manejar el evento del selector de pagos
  handlePaymentSubmit(event: { method: string, data: any }) {
    this.customerInfo.paymentMethod = event.method;

    console.log('Validando formulario...', this.validateForm()); // Agregar log para depuración
    if (this.validateForm()) {
      // Continuar con el proceso
    } else {
      console.log('Formulario no válido'); // Agregar log para depuración
      alert('Por favor, complete todos los campos requeridos.');
    }
  
    // Validar el formulario antes de continuar
    if (this.validateForm()) {
      try {
        // Almacenar el correo del usuario en el servicio CartService
        this.cartService.setCustomerEmail(this.customerInfo.email);
  
        if (event.method === 'transfer') {
          // Enviar la confirmación de transferencia al backend
          this.mercadoPagoService.sendBankTransferConfirmation({
            customerEmail: this.customerInfo.email, // Correo del usuario
            transferDetails: {
              ...event.data,
              amount: this.total
            }
          })
          .then((response) => {
            console.log('Respuesta del backend:', response); // Agregar log para depuración
            this.router.navigate(['/checkout/confirmation'], {
              queryParams: {
                method: 'transfer',
                amount: this.total
              }
            });
          })
          .catch((error) => {
            console.error('Error al enviar confirmación:', error);
            alert('No se pudo enviar el correo de confirmación. Por favor, inténtelo de nuevo.');
          });
        }
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
      this.customerInfo.lastName
    );
  }
}