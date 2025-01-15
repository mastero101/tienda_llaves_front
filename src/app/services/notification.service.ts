import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor() {}

  async sendNotification(data: any) {
    try {
      const response = await axios.post(`${environment.apiUrl}/notifications`, data);
      return response.data;
    } catch (error) {
      console.error('Error al enviar notificación:', error);
      throw error;
    }
  }
} 