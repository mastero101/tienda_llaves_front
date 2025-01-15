import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MercadoPagoService } from '../../../services/mercado-pago.service';
import { NotificationService } from '../../../services/notification.service';
import { isPlatformBrowser } from '@angular/common';

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
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
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

  private async initializeMercadoPago() {
    if (!isPlatformBrowser(this.platformId)) return;

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
              console.log('Procesando pago...', cardFormData);
              
              const paymentData = {
                token: cardFormData.token,
                issuer_id: cardFormData.issuer_id,
                payment_method_id: cardFormData.payment_method_id,
                transaction_amount: Number(this.amount),
                installments: cardFormData.installments || 1,
                payer: {
                  email: cardFormData.payer.email
                }
              };

              const response = await this.mercadoPagoService.processPayment(paymentData);
              console.log('Respuesta del pago:', response);
              
              if (response.status === 'approved') {
                await this.sendPaymentNotification(response);
              }

              this.paymentResponse = response;
              this.showPaymentModal = true;
              this.cdr.detectChanges();

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
        this.paymentSubmit.emit({
          method: 'transfer',
          data: null
        });
        this.showConfirmation = true;
        setTimeout(() => this.showConfirmation = false, 3000);
      }
    } catch (error) {
      console.error('Error al procesar el pago:', error);
    }
  }

  private async sendPaymentNotification(paymentData: any) {
    try {
      const notificationData = {
        paymentId: paymentData.id,
        amount: paymentData.transaction_amount,
        date: new Date().toISOString(),
        customerEmail: paymentData.payer.email,
        status: paymentData.status,
        paymentMethod: paymentData.payment_method_id
      };

      await this.notificationService.sendNotification(notificationData);
      console.log('Notificación enviada exitosamente');
    } catch (error) {
      console.error('Error al enviar notificación:', error);
    }
  }
}