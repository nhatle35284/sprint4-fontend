import {Routes} from '@angular/router';
import {CartComponent} from './component/cart/cart.component';
import {CheckoutComponent} from './component/checkout/checkout.component';
import {ShopComponent} from './component/shop/shop.component';
import {LoginComponent} from '../app-common/component/login/login.component';

export const shopRoute: Routes = [
  { path: 'cart', component: CartComponent},
  { path: 'checkout', component: CheckoutComponent},
  { path: 'shop', component: ShopComponent},
];

