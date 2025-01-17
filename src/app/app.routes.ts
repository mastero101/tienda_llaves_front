import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { CartComponent } from './pages/cart/cart.component';
import { ProductdetailComponent } from './pages/productdetail/productdetail.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { OrderConfirmationComponent } from './pages/checkout/order-confirmation/order-confirmation.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'productos', component: ProductsComponent },
  { path: 'carrito', component: CartComponent },
  { path: 'productos/:id', component: ProductdetailComponent },
  { path: 'checkout', component: CheckoutComponent },
  {
    path: 'checkout/confirmation',
    component: OrderConfirmationComponent
  },
  { path: '**', redirectTo: '' }
];
