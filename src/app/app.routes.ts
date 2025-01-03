import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { CartComponent } from './pages/cart/cart.component';
import { ProductdetailComponent } from './pages/productdetail/productdetail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'productos', component: ProductsComponent },
  { path: 'carrito', component: CartComponent },
  { path: 'productos/:id', component: ProductdetailComponent },
  { path: '**', redirectTo: '' }
];
