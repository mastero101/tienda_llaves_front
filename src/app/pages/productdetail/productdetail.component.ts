import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../interfaces/product.interface';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-productdetail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productdetail.component.html',
  styleUrl: './productdetail.component.scss'
})

export class ProductdetailComponent implements OnInit, OnDestroy {
  product: Product | undefined;
  quantity: number = 1;
  private routeSub: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // Suscribirse a los cambios de parámetros de la ruta
    this.routeSub = this.route.paramMap.subscribe((params: ParamMap) => {
      const id = Number(params.get('id'));
      this.product = this.productService.getProductById(id);
      
      if (!this.product) {
        this.router.navigate(['/productos']);
      }
      
      // Resetear la cantidad cuando cambia el producto
      this.quantity = 1;
      
      // Hacer scroll al inicio de la página solo si estamos en el navegador
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo(0, 0);
      }
    });
  }

  ngOnDestroy() {
    // Limpieza de la suscripción
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  addToCart() {
    if (this.product && this.quantity > 0) {
      this.cartService.addToCart(this.product, this.quantity);
      // Opcional: Mostrar mensaje de éxito
    }
  }

  updateQuantity(change: number) {
    const newQuantity = this.quantity + change;
    if (newQuantity >= 1) {
      this.quantity = newQuantity;
    }
  }
}
