import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

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

  async initCardPayment(amount: number): Promise<void> {
    try {
      await this.waitForSDK();
      
      const bricksBuilder = this.mp.bricks();
      
      const renderComponent = async (brickType: string) => {
        await bricksBuilder.create(brickType, brickType + "_container", {
          initialization: {
            amount: amount
          },
          callbacks: {
            onReady: () => {
              console.log(`${brickType} brick listo`);
            },
            onSubmit: async (cardFormData: any) => {
              try {
                // Aquí recibirías los datos de la tarjeta tokenizados
                console.log('Datos del formulario:', cardFormData);
                // Normalmente aquí enviarías estos datos a tu backend
              } catch (error) {
                console.error('Error en el pago:', error);
              }
            },
            onError: (error: any) => {
              console.error(`Error en ${brickType} brick:`, error);
            }
          },
          customization: {
            visual: {
              style: {
                theme: 'default'
              }
            }
          }
        });
      };

      // Renderizar los componentes necesarios
      await renderComponent('cardPayment');
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
}