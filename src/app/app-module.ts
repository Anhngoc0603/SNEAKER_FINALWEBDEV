import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common'; // Added for *ngIf/ngFor
import { FormsModule } from '@angular/forms'; // Added for ngModel

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Login } from './login/login';
import { Register } from './register/register';
import { Admin } from './admin/admin';
import { Checkout } from './checkout/checkout';

@NgModule({
  declarations: [
    App,
    Login,
    Register,
    Admin,
    Checkout
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
