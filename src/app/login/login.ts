import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  onLogin(event: Event) {
    event.preventDefault();
    console.log('Login attempt');
  }
}
