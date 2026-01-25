import { Component } from '@angular/core';

@Component({
    selector: 'app-register',
    standalone: false,
    templateUrl: './register.html',
    styleUrl: './register.css',
})
export class Register {
    onRegister(event: Event) {
        event.preventDefault();
        console.log('Register attempt');
    }
}
