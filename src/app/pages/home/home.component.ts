import { Component, OnInit, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { register } from 'swiper/element/bundle';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product.interface';

// Registrar Swiper
register();

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, AfterViewInit {
  products: Product[] = [];
  featuredProducts: Product[] = [];
  defaultImageUrl = 'data:image/svg+xml;base64,...';

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.products = this.productService.getProducts();
    this.featuredProducts = this.products.filter(product => 
      [2, 3, 6].includes(product.id)
    );
  }

  ngAfterViewInit() {
    // Esperar a que el DOM esté listo
    setTimeout(() => {
      if (typeof document !== 'undefined') {
        const style = document.createElement('style');
        style.textContent = `
          swiper-container::part(pagination) {
            bottom: -25px !important;
          }
          swiper-container::part(bullet) {
            background-color: #3b82f6;
            opacity: 0.5;
          }
          swiper-container::part(bullet-active) {
            background-color: #3b82f6;
            opacity: 1;
          }
        `;
        document.head.appendChild(style);
      }
    }, 0);
  }

  goToProduct(id: number) {
    this.router.navigate(['/productos', id]);
  }

  handleImageError(event: any) {
    event.target.src = this.defaultImageUrl;
  }
}
