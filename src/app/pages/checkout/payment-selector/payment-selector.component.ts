import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MercadoPagoService } from '../../../services/mercado-pago.service';

interface CardData {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
}

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
  showPaymentConfirmation: boolean = false;
  paymentResponse: any = null;

  bankInfo = {
    name: 'Nu Bank',
    accountHolder: 'Alejandro Castro',
    clabe: '638180000129689296'
  };

  constructor(private mercadoPagoService: MercadoPagoService) { }

  ngAfterViewInit() {
    console.log('Vista inicializada');
  }

  onMethodChange(method: string) {
    this.selectedMethod = method;
    if (method === 'card') {
      setTimeout(() => {
        this.initializeMercadoPago();
      }, 100);
    }
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
              const paymentData = {
                token: cardFormData.token,
                issuer_id: cardFormData.issuer_id,
                payment_method_id: cardFormData.payment_method_id,
                transaction_amount: Number(this.amount),
                installments: cardFormData.installments || 1,
                payer: {
                  email: cardFormData.payer.email,
                  identification: {
                    type: "DNI",
                    number: "12345678"
                  }
                }
              };

              const response = await this.mercadoPagoService.processPayment(paymentData);
              console.log('Respuesta del pago:', response);
              
              if (response.status === 'approved') {
                alert(`Pago Exitoso
                  \nID: ${response.id}
                  \nEstatus: ${response.status}
                  \nMonto: ${response.transaction_amount}`);
              } else {
                alert(`Pago Rechazado
                  \nMotivo: ${response.status_detail}
                  \nPor favor, intente con otra tarjeta`);
              }

            } catch (error) {
              console.error('Error en el pago:', error);
              alert('Error al procesar el pago');
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
}