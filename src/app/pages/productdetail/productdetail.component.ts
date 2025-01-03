import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../interfaces/product.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-productdetail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productdetail.component.html',
  styleUrl: './productdetail.component.scss'
})
export class ProductdetailComponent implements OnInit {
  product: Product | undefined;
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.product = this.productService.getProductById(id);
    
    if (!this.product) {
      this.router.navigate(['/productos']);
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
