import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
export class HomeComponent implements OnInit {
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

  goToProduct(id: number) {
    this.router.navigate(['/productos', id]);
  }

  handleImageError(event: any) {
    console.error('Error cargando imagen:', event.target.src);
    event.target.src = '/assets/products/placeholder.jpg';
  }
}
