import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor() {
    
  }

  // Método para obtener las ventas con filtros opcionales
  async getSales(searchQuery: string = '', status: string = ''): Promise<any> {
    try {
      // Construir el endpoint con parámetros de búsqueda
      let url = `${environment.apiUrl}/sales`;

      const params: any = {};
      if (searchQuery) params.search = searchQuery;
      if (status) params.status = status;

      // Realizar la llamada GET con Axios
      const response = await axios.get(url, { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener las ventas', error);
      throw error;
    }
  }
}
