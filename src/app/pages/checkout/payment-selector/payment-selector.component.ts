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
      await this.mercadoPagoService.initCardPayment(this.amount);
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