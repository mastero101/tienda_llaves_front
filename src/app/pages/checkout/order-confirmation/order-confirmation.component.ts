import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { CartItem } from '../../../interfaces/cart-item.interface';
import axios from 'axios';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.scss'
})
export class OrderConfirmationComponent implements OnInit {
  orderId: string = '';
  paymentStatus: string = '';
  cartItems: CartItem[] = [];
  total: number = 0;
  customerInfo = {
    email: '' // Asegúrate de tener esta información disponible
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit() {
    // Obtener los parámetros de la URL
    this.route.queryParams.subscribe(params => {
      this.orderId = params['orderId'] || 'No disponible';
      this.paymentStatus = params['status'] || 'Procesado';
    });
    // Obtener los items del carrito
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getTotal();
    });
    // Enviar correo de confirmación
    //this.sendConfirmationEmail();
  }
  
  sendConfirmationEmail() {
    const emailData = {
      email: this.customerInfo.email,
      orderId: this.orderId,
      items: this.cartItems.map(item => `${item.quantity}x ${item.product.name}`).join(', '),
      total: this.total
    };

    axios.post(`${environment.apiUrl}/process-payment`, emailData)
      .then((response: { data: any; }) => {
        console.log('Correo de confirmación enviado:', response.data);
      })
      .catch((error: any) => {
        console.error('Error al enviar el correo de confirmación:', error);
        console.log(emailData)
      });
  }


  goToHome() {
    this.router.navigate(['/']);
    // Limpiar el carrito después de mostrar el resumen
    this.cartService.clearCart();
  }
}
