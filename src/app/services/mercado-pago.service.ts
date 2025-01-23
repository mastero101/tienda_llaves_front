import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';
import axios from 'axios';

declare var MercadoPago: any;

@Injectable({
  providedIn: 'root'
})
export class MercadoPagoService {
  public mp: any;
  private isSDKLoaded: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.initializeMercadoPago();
  }

  async initCardPayment(amount: number): Promise<void> {
    try {
      await this.waitForSDK();
      
      const bricksBuilder = this.mp.bricks();
      
      // Usar el ID correcto del contenedor
      const renderComponent = async () => {
        await bricksBuilder.create("cardPayment", "cardPaymentBrick_container", {
          initialization: {
            amount: amount
          },
          callbacks: {
            onReady: () => {
              console.log('Brick listo');
            },
            onSubmit: async (cardFormData: any) => {
              try {
                console.log('Datos del formulario:', cardFormData);
        
                // Esperar 5 segundos antes de mostrar el alert
                setTimeout(() => {
                  alert("Pago Exitoso");
                }, 5000); // 5000 milisegundos = 5 segundos

              } catch (error) {
                console.error('Error en el pago:', error);
              }
            },
            onError: (error: any) => {
              console.error('Error en brick:', error);
            }
          },
          style: {
            theme: 'default'
          }
        });
      };

      await renderComponent();
    } catch (error) {
      console.error('Error al inicializar el pago:', error);
      throw error;
    }
  }

  private async waitForSDK(): Promise<void> {
    if (!this.isSDKLoaded) {
      await this.initializeMercadoPago();
    }
  }

  private initializeMercadoPago(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (isPlatformBrowser(this.platformId)) {
        if (this.isSDKLoaded) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://sdk.mercadopago.com/js/v2';
        script.onload = () => {
          this.mp = new MercadoPago(environment.mercadoPagoPublicKey);
          this.isSDKLoaded = true;
          console.log('MercadoPago SDK inicializado correctamente');
          resolve();
        };
        script.onerror = (error) => {
          console.error('Error al cargar MercadoPago SDK:', error);
          reject(error);
        };
        document.body.appendChild(script);
      } else {
        reject('No estamos en un navegador');
      }
    });
  }

  async processPayment(paymentData: any) {
    try {
      // Asegurarse de que transaction_amount sea un número
      const formattedPaymentData = {
        ...paymentData,
        transaction_amount: Number(paymentData.transaction_amount),
        installments: Number(paymentData.installments)
      };

      const response = await axios.post(`${environment.apiUrl}/process-payment`, formattedPaymentData);
      return response.data;
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      throw error;
    }
  }
  
  sendBankTransferConfirmation(data: any): Promise<any> {
    return axios.post(`${environment.apiUrl}/bank-transfer-confirmation`, data)
      .then(response => response.data)
      .catch(error => {
        console.error('Error al enviar confirmación de transferencia:', error);
        throw error;
      });
  }
}