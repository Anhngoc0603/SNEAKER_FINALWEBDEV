import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common'; // Added for *ngIf/ngFor
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Added for ngModel

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Login } from './login/login';
import { Register } from './register/register';
import { Admin } from './admin/admin';
import { Checkout } from './checkout/checkout';
import { About } from './about/about';
import { Footer } from './footer/footer';
import { CartComponent } from './cart/cart';
import { Contact } from './contact/contact';
import { Homepage } from './homepage/homepage';
import { Header } from './header/header';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    App,
    Login,
    Register,
    Admin,
    Checkout,
    About,
    Footer,
    CartComponent,
    Homepage,
    Contact,

    Header
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
