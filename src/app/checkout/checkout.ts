import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.html',
    styleUrl: './checkout.css',
    standalone: false
})
export class Checkout implements OnInit {
    orderComplete: boolean = false;

    // Mock Cart Data
    cartItems = [
        { name: 'Nike Air Max 270', price: 150.00, quantity: 1, image: 'assets/images/shoes/1.jpg' },
        { name: 'Adidas Ultra Boost', price: 180.00, quantity: 1, image: 'assets/images/shoes/2.jpg' }
    ];

    subtotal: number = 330.00;
    total: number = 330.00;

    ngOnInit() {
        // In a real app, fetch cart from service
    }

    onPlaceOrder(event: Event) {
        event.preventDefault();
        // Simulate API call
        setTimeout(() => {
            this.orderComplete = true;
            // Clear cart logic here
        }, 1000);
    }
}
