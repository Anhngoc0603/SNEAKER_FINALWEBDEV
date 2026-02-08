import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { Admin } from './admin/admin';
import { Checkout } from './checkout/checkout';
import { Contact } from './contact/contact';
import { About } from './about/about';
import { Cart } from './cart/cart';

const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'admin', component: Admin },
  { path: 'checkout', component: Checkout },
  { path: 'about', component: About },
  { path: 'contact', component: Contact },
  { path: 'cart', component: Cart },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
