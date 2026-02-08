import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../app/data/products';

export interface CartItem extends Product {
    quantity: number;
    selectedSize: number;
    selectedColor: string;
}

@Injectable({
  providedIn: 'root',
})
export class Cart {
    private cartItems: CartItem[] = [];
    private cartCountSubject = new BehaviorSubject<number>(0);

    cartCount$ = this.cartCountSubject.asObservable();

    constructor() { }

    getCartItems(): CartItem[] {
        return this.cartItems;
    }

    addToCart(product: Product, size?: number, color?: string) {
        const existingItem = this.cartItems.find(item =>
            item.id === product.id &&
            item.selectedSize === (size || product.sizes[0]) &&
            item.selectedColor === (color || product.colors[0])
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cartItems.push({
                ...product,
                quantity: 1,
                selectedSize: size || product.sizes[0],
                selectedColor: color || product.colors[0]
            });
        }

        this.updateCartCount();
    }

    removeFromCart(item: CartItem) {
        const index = this.cartItems.indexOf(item);
        if (index > -1) {
            this.cartItems.splice(index, 1);
            this.updateCartCount();
        }
    }

    updateQuantity(item: CartItem, quantity: number) {
        if (quantity <= 0) {
            this.removeFromCart(item);
            return;
        }

        const cartItem = this.cartItems.find(i => i === item);
        if (cartItem) {
            cartItem.quantity = quantity;
            this.updateCartCount();
        }
    }

    getCartTotal(): number {
        return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getCartCount(): number {
        return this.cartCountSubject.value;
    }

    private updateCartCount() {
        const count = this.cartItems.reduce((total, item) => total + item.quantity, 0);
        this.cartCountSubject.next(count);
    }  
}
