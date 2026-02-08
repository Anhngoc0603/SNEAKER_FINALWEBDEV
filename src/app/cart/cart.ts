import { Component } from '@angular/core';
import { CartItem } from '../../services/cart';


@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  cartItems: CartItem[] = [];
    total = 0;

    constructor(private cartService: Cart) { }

    ngOnInit(): void {
        this.loadCart();
    }

    loadCart() {
        this.cartItems = this.cartService.getCartItems();
        this.calculateTotal();
    }

    updateQuantity(item: CartItem, change: number) {
        const newQuantity = item.quantity + change;
        this.cartService.updateQuantity(item, newQuantity);
        this.loadCart(); // Refresh view
    }

    removeItem(item: CartItem) {
        this.cartService.removeFromCart(item);
        this.loadCart(); // Refresh view
    }

    calculateTotal() {
        this.total = this.cartService.getCartTotal();
    }

    getColorName(hex: string): string {
        const colorMap: { [key: string]: string } = {
            '#000000': 'Black',
            '#ffffff': 'White',
            '#ef4444': 'Red',
            '#3b82f6': 'Blue',
            '#10b981': 'Green',
            '#f97316': 'Orange',
            '#9ca3af': 'Gray',
            '#92400e': 'Brown',
            '#a855f7': 'Purple',
            '#1e40af': 'Navy',
            '#f5f5dc': 'Cream'
        };
        return colorMap[hex.toLowerCase()] || 'Custom';
    }

    formatPrice(price: number): string {
        return `$${price.toFixed(2)}`;
    }
}
