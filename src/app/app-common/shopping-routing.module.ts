import {Routes} from '@angular/router';
import {AboutComponent} from './component/about/about.component';
import {BlogComponent} from './component/blog/blog.component';
import {ContactComponent} from './component/contact/contact.component';
import {HomePageComponent} from './component/home-page/home-page.component';
import {LoginComponent} from './component/login/login.component';

export const commonRoute: Routes = [
  { path: 'about', component: AboutComponent},
  { path: 'blog', component: BlogComponent},
  { path: 'contact', component: ContactComponent},
  { path: '', component: HomePageComponent},
  { path: 'login', component: LoginComponent},

];

