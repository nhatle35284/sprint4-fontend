import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GoodManagerComponent} from './component/good-manager/good-manager.component';
import {GoodAddComponent} from './component/good-add/good-add.component';
import {UserManagerComponent} from './component/user-manager/user-manager.component';
import {UserCreateComponent} from './component/user-create/user-create.component';
import {UserDeleteComponent} from './component/user-delete/user-delete.component';
import {UserEditComponent} from './component/user-edit/user-edit.component';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {adminRoute} from './admin-routing.module';
import {NgxPaginationModule} from 'ngx-pagination';
import { GoodDeleteComponent } from './component/good-delete/good-delete.component';
import {MatDialogModule} from '@angular/material/dialog';
import { GoodEditComponent } from './component/good-edit/good-edit.component';
import { GoodDetailsComponent } from './component/good-details/good-details.component';
import { BillComponent } from './component/bill/bill.component';


@NgModule({
  declarations: [
    GoodManagerComponent,
    GoodAddComponent,
    UserManagerComponent,
    UserCreateComponent,
    UserDeleteComponent,
    UserEditComponent,
    GoodDeleteComponent,
    GoodEditComponent,
    GoodDetailsComponent,
    BillComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(adminRoute),
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    MatDialogModule
  ]
})
export class AdminModule {
}
