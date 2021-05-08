import {Routes} from '@angular/router';
import {GoodManagerComponent} from './component/good-manager/good-manager.component';
import {UserManagerComponent} from './component/user-manager/user-manager.component';
import {UserCreateComponent} from './component/user-create/user-create.component';
import {UserDeleteComponent} from './component/user-delete/user-delete.component';
import {UserEditComponent} from './component/user-edit/user-edit.component';
import {GoodAddComponent} from './component/good-add/good-add.component';
import {BillComponent} from './component/bill/bill.component';

export const adminRoute: Routes = [
  { path: 'good-manager', component: GoodManagerComponent},
  { path: 'good-add', component: GoodAddComponent},
  { path: 'user-manager', component: UserManagerComponent},
  { path: 'user-create', component: UserCreateComponent},
  { path: 'user-delete', component: UserDeleteComponent},
  { path: 'user-edit', component: UserEditComponent},
  { path: 'bill-manager', component: BillComponent},

];

