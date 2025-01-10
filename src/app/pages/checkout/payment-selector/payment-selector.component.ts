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

  bankInfo = {
    name: 'Banco Example',
    accountHolder: 'Company Name',
    clabe: '012345678901234567'
  };

  constructor(private mercadoPagoService: MercadoPagoService) { }

  ngAfterViewInit() {
    // El contenedor ya existe en el DOM aunque esté oculto
    console.log('Vista inicializada');
  }

  onMethodChange() {
    console.log('Método cambiado a:', this.selectedMethod);
    if (this.selectedMethod === 'card') {
      // Usar setTimeout para asegurar que el cambio de visibilidad se complete
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