import { Component, OnInit } from '@angular/core';
import { SalesService } from '../../services/sales.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.scss'
})
export class SalesComponent implements OnInit {
  sales: any[] = [];
  searchQuery: string = '';
  status: string = '';
  selectedDate: string = '';

  filteredSales: any[] = [];
  paginatedSales: any[] = []; // Lista de ventas para la página actual

  // Configuración de paginación
  itemsPerPage: number = 5; // Número de ventas por página
  currentPage: number = 1;

  password: string = '';
  isAuthenticated: boolean = false;
  private readonly PASSWORD = 'mastero101';
  private readonly AUTH_EXPIRATION = 15 * 60 * 1000;

  constructor(private salesService: SalesService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.checkAuthStatus();
  }

  // Obtener las ventas desde el servicio
  async fetchSales(): Promise<void> {
    try {
      console.log('Fetching sales...');
      this.sales = await this.salesService.getSales(
        this.searchQuery,
        this.status === 'approved' ? 'paid' : this.status
      );
      console.log('Sales data:', this.sales);
      this.onFilterChange(); // Aplicar filtros y actualizar paginación
    } catch (error) {
      console.error('Error al recuperar las ventas', error);
    }
  }  

  // Filtrar ventas
  onFilterChange(): void {
    this.filteredSales = this.sales.filter((sale) => {
      const matchesSearchQuery =
        sale.payment_id.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        sale.customer_email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        sale.description.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesStatus =
        this.status === '' ||
        sale.payment_status.toLowerCase() === this.status.toLowerCase() ||
        (this.status === 'approved' && sale.payment_status.toLowerCase() === 'paid');

      const saleDate = new Date(sale.purchase_date);
      saleDate.setMinutes(saleDate.getMinutes() - saleDate.getTimezoneOffset());
      const formattedSaleDate = saleDate.toISOString().split('T')[0];

      const matchesDate = !this.selectedDate || formattedSaleDate === this.selectedDate;

      return matchesSearchQuery && matchesStatus && matchesDate;
    });

    this.currentPage = 1; // Reiniciar a la primera página al filtrar
    this.updatePagination();
  }

  // Actualizar paginación
  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedSales = this.filteredSales.slice(startIndex, endIndex);
  }

  // Cambiar de página
  changePage(direction: number): void {
    const totalPages = Math.ceil(this.filteredSales.length / this.itemsPerPage);
    const newPage = this.currentPage + direction;

    if (newPage >= 1 && newPage <= totalPages) {
      this.currentPage = newPage;
      this.updatePagination();
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredSales.length / this.itemsPerPage);
  }

  checkPassword(): void {
    if (this.password === this.PASSWORD) {
      const expirationTime = Date.now() + this.AUTH_EXPIRATION;
      this.generateHash(expirationTime, this.PASSWORD).then(hash => {
        // Almacenar en localStorage
        if (typeof window !== 'undefined' && localStorage) {
          localStorage.setItem('auth', JSON.stringify({ hash, expiresAt: expirationTime }));
        }
        
        // Actualizar el estado de autenticación
        this.isAuthenticated = true;
  
        // Llamar a backend para cargar las ventas de inmediato
        this.fetchSales();
      });
    } else {
      alert('Contraseña incorrecta');
    }
  }
  

  checkAuthStatus(): void {
    if (typeof window !== 'undefined' && localStorage) {
      const authData = localStorage.getItem('auth');
      if (authData) {
        const { hash, expiresAt } = JSON.parse(authData);
      
        // Verificar si el token no ha expirado
        if (Date.now() < expiresAt) {
          this.generateHash(expiresAt, this.PASSWORD).then(expectedHash => {
            if (hash === expectedHash) {
              this.isAuthenticated = true;
              // Llamar a fetchSales si está autenticado
              this.fetchSales();
            } else {
              this.isAuthenticated = false;
              alert('Intento de manipulación detectado');
            }
          });
        } else {
          localStorage.removeItem('auth'); // Expiró, eliminar del almacenamiento
          this.isAuthenticated = false;
        }
      } else {
        this.isAuthenticated = false;
      }
    }
  }  

  // Función para generar un hash basado en el tiempo de expiración y la contraseña
  generateHash(expirationTime: number, password: string): Promise<string> {
    const data = expirationTime + password;
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    return window.crypto.subtle.digest('SHA-256', dataBuffer).then((hashBuffer) => {
      const hashArray = Array.from(new Uint8Array(hashBuffer)); // Convertir a un array de bytes
      const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join(''); // Convertir a hexadecimal
      return hashHex;
    });
  }  
}
