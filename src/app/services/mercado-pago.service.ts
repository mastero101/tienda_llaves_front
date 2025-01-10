import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';
import { delay } from 'rxjs';

declare var MercadoPago: any;

@Injectable({
  providedIn: 'root'
})
export class MercadoPagoService {
  private mp: any;
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
        
                setTimeout(() => {
                  alert(`Pago Exitoso
                          \nToken: ${cardFormData.token}
                          \nCliente: ${cardFormData.payer.email}
                          \nMetodo Pago: ${cardFormData.payment_method_id}
                          \nCantidad: ${cardFormData.transaction_amount}
                        `);
                }, 3000);

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
}