import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from './component/cart/cart.component';
import { CheckoutComponent } from './component/checkout/checkout.component';
import { ShopComponent } from './component/shop/shop.component';
import {RouterModule} from '@angular/router';
import {shopRoute} from './shopping-routing.module';
import {LoginComponent} from '../app-common/component/login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DeleteGoodCartComponent } from './component/delete-good-cart/delete-good-cart.component';
import {MatDialogModule} from '@angular/material/dialog';
import { ConfirmComponent } from './component/confirm/confirm.component';



@NgModule({
  declarations: [
    CartComponent,
    CheckoutComponent,
    ShopComponent,
    DeleteGoodCartComponent,
    ConfirmComponent,
  ],
  exports: [
  ],
    imports: [
        CommonModule,
        RouterModule.forChild(shopRoute),
        ReactiveFormsModule,
        FormsModule,
        MatDialogModule
    ]
})
export class ShoppingModule { }
