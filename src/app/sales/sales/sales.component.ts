import { Component, OnInit } from '@angular/core';
import { SalesService } from '../../services/sales.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  constructor(private salesService: SalesService) {}

  ngOnInit(): void {
    this.fetchSales();
  }

  // Obtener las ventas desde el servicio
  async fetchSales(): Promise<void> {
    try {
      this.sales = await this.salesService.getSales(
        this.searchQuery,
        this.status === 'approved' ? 'paid' : this.status
      );
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
}
