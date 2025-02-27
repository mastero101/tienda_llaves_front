import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/environment';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'https://api.openai.com/v1/chat/completions';

  constructor(private productService: ProductService) {}

  async sendMessage(message: string): Promise<string> {
    try {
      // Obtener productos actuales para el contexto
      const products = this.productService.getProducts();
      const productInfo = products.map(p => `${p.name}: $${p.price}`).join(', ');

      const response = await axios.post(
        this.apiUrl,
        {
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `Eres un asistente virtual especializado en ventas de licencias de software. 
              Productos disponibles actualmente: ${productInfo}.
              
              Instrucciones específicas:
              - Saluda de manera profesional y amigable
              - Si preguntan por precios, menciona los precios exactos de nuestro catálogo
              - Para Windows, menciona que son licencias digitales originales de Microsoft
              - Para Office, explica la diferencia entre versiones perpetuas y suscripciones
              - Para antivirus, destaca las características de seguridad
              - Menciona que todas las licencias incluyen garantía y soporte técnico
              - Si preguntan por instalación, ofrece guiar paso a paso
              - Si preguntan por métodos de pago, menciona que aceptamos Tarjetas y Transferencias Bancarias SPEi
              - Si preguntan por tiempo de entrega, indica que es de 30min a 24 hrs tras confirmar el pago
              - Mantén un tono profesional pero cercano
              - Si no conoces algún detalle específico, sugiere contactar con soporte técnico
              
              Información importante:
              - Todas las licencias son originales y permanentes
              - Entrega de 30 min a 24 hrs por email
              - Garantía de activación
              - Soporte técnico incluido`
            },
            {
              role: 'user',
              content: message
            }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${environment.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error en la llamada a ChatGPT:', error);
      throw error;
    }
  }
}
