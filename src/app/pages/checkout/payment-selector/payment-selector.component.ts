import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MercadoPagoService } from '../../../services/mercado-pago.service';
import { isPlatformBrowser } from '@angular/common';
import { CartService } from '../../../services/cart.service';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-selector.component.html',
  styleUrl: './payment-selector.component.scss'
})
export class PaymentSelectorComponent implements AfterViewInit {
  @Input() amount: number = 0;
  @Output() paymentSubmit = new EventEmitter<{ method: string, data: any }>();
  @ViewChild('cardPaymentContainer') cardPaymentContainer!: ElementRef;

  selectedMethod: string = '';
  showConfirmation: boolean = false;
  showCopied: boolean = false;
  showPaymentModal: boolean = false;
  paymentResponse: any = null;

  bankInfo = {
    name: 'Nu Bank',
    accountHolder: 'Alejandro Castro',
    clabe: '638180000129689296'
  };

  constructor(
    private mercadoPagoService: MercadoPagoService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cartService: CartService,
    private router: Router
  ) { }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      console.log('Vista inicializada en el navegador');
    }
  }

  closePaymentModal() {
    this.showPaymentModal = false;
    this.paymentResponse = null;
  }

  getErrorMessage(statusDetail: string): string {
    const errorMessages: { [key: string]: string } = {
      'cc_rejected_bad_filled_date': 'Fecha de vencimiento incorrecta',
      'cc_rejected_bad_filled_security_code': 'Código de seguridad incorrecto',
      'cc_rejected_card_disabled': 'Tarjeta deshabilitada',
      'cc_rejected_call_for_authorize': 'Necesita autorización',
      'cc_rejected_insufficient_amount': 'Fondos insuficientes',
      'cc_rejected_other_reason': 'Tarjeta rechazada por otra razón',
      'default': 'Error al procesar el pago'
    };

    return errorMessages[statusDetail] || errorMessages['default'];
  }

  onMethodChange(method: string) {
    if (!isPlatformBrowser(this.platformId)) return;
    
    this.selectedMethod = method;
    if (method === 'card') {
      setTimeout(() => {
        this.initializeMercadoPago();
      }, 100);
    }
  }

  private async formatCartItemsDescription(): Promise<string> {
    const items = await firstValueFrom(this.cartService.cartItems$);
    return items.map(item => 
      `${item.quantity}x ${item.product.name} ($${item.product.price} MXN)`
    ).join(', ');
  }

  private async initializeMercadoPago() {
    try {
      console.log('Inicializando MercadoPago...');
      const bricksBuilder = this.mercadoPagoService.mp.bricks();
      
      await bricksBuilder.create("cardPayment", "cardPaymentBrick_container", {
        initialization: {
          amount: this.amount
        },
        callbacks: {
          onReady: () => {
            console.log('Brick listo');
          },
          onSubmit: async (cardFormData: any) => {
            try {
              const itemsDescription = await this.formatCartItemsDescription();
              
              const paymentData = {
                token: cardFormData.token,
                issuer_id: cardFormData.issuer_id,
                payment_method_id: cardFormData.payment_method_id,
                transaction_amount: Number(this.amount),
                installments: cardFormData.installments || 1,
                description: itemsDescription,
                payer: {
                  email: cardFormData.payer?.email || 'no-email@example.com'
                }
              };

              console.log('Enviando datos de pago:', paymentData);
              const response = await this.mercadoPagoService.processPayment(paymentData);
              
              if (response.status === 'approved') {
                const notificationData = {
                  ...response,
                  items: this.cartService.cartItems.value,
                  itemsDescription: itemsDescription,
                  payer: {
                    ...response.payer,
                    email: cardFormData.payer?.email || response.payer?.email || 'no-email@example.com'
                  }
                };
                
                this.showPaymentModal = true;
                this.paymentResponse = response;
                this.cdr.detectChanges();

                setTimeout(() => {
                  this.router.navigate(['/checkout/confirmation'], {
                    queryParams: {
                      orderId: response.id,
                      status: response.status
                    }
                  });
                }, 3000);
              }

            } catch (error) {
              console.error('Error en el pago:', error);
              this.paymentResponse = {
                status: 'error',
                status_detail: 'Error al procesar el pago'
              };
              this.showPaymentModal = true;
              this.cdr.detectChanges();
            }
          },
          onError: (error: any) => {
            console.error('Error en brick:', error);
          }
        }
      });
    } catch (error) {
      console.error('Error al inicializar MercadoPago:', error);
    }
  }

  async copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      this.showCopied = true;
      setTimeout(() => {
        this.showCopied = false;
      }, 2000);
    } catch (err) {
      console.error('Error al copiar al portapapeles:', err);
    }
  }

  async onSubmit() {
    try {
      if (this.selectedMethod === 'transfer') {
        // Obtener los artículos del carrito
        const cartItems = await firstValueFrom(this.cartService.cartItems$);
        console.log('Artículos del carrito:', cartItems); // Agregar log para depuración
  
        // Obtener el correo del cliente
        const customerEmail = this.cartService.getCustomerEmail();
        console.log('Correo del cliente:', customerEmail); // Agregar log para depuración
  
        // Emitir el evento con los datos de la transferencia, los artículos y el correo
        this.paymentSubmit.emit({
          method: 'transfer',
          data: {
            bankInfo: this.bankInfo,
            amount: this.amount,
            items: cartItems, // Incluir los artículos del carrito
            customerEmail: customerEmail // Incluir el correo del cliente
          }
        });
  
        // Simular la confirmación de la transferencia
        const response = {
          status: 'approved',
          id: `TRANSFER-${Date.now()}`, // ID de transferencia
          transaction_amount: this.amount
        };
  
        this.paymentResponse = response;
        this.showPaymentModal = true;
  
        // Navegar a la página de confirmación después de un retraso
        setTimeout(() => {
          this.router.navigate(['/checkout/confirmation'], {
            queryParams: {
              orderId: response.id, // Usar el ID de transferencia
              status: 'Waiting',
              method: 'transfer'
            }
          });
        }, 3000);
      }
    } catch (error) {
      console.error('Error al procesar el pago:', error);
    }
  }
}