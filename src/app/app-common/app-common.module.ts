import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HeaderComponent} from './component/header/header.component';
import {FooterComponent} from './component/footer/footer.component';
import {HomePageComponent} from './component/home-page/home-page.component';
import {AboutComponent} from './component/about/about.component';
import {BlogComponent} from './component/blog/blog.component';
import {ContactComponent} from './component/contact/contact.component';
import {RouterModule} from '@angular/router';
import {commonRoute} from './shopping-routing.module';
import {LoginComponent} from './component/login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {FacebookLoginProvider, GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule} from 'angularx-social-login';
import {NgxPaginationModule} from 'ngx-pagination';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    HomePageComponent,
    AboutComponent,
    BlogComponent,
    ContactComponent,
    LoginComponent
  ],
  exports: [
    HeaderComponent,
    FooterComponent
  ],
    imports: [
        CommonModule,
        RouterModule.forChild(commonRoute),
        ReactiveFormsModule,
        FormsModule,
        SocialLoginModule,
        MatDialogModule,
        NgxPaginationModule
    ],
  providers: [{
    provide: 'SocialAuthServiceConfig',
    useValue: {
      autoLogin: false,
      providers: [{
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider('905481666896860'),
      },
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider('602932671743-6ch4cst6a0pc73fosockp29h2b8e59eh.apps.googleusercontent.com'),
        },
      ],
    } as SocialAuthServiceConfig,
  }],
})
export class AppCommonModule { }
