import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: number;
  name: string;
  brand: string;
  price: number;
  image: string;
  size: number;
  color: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();

  private isOpen = new BehaviorSubject<boolean>(false);
  isOpen$ = this.isOpen.asObservable();

  constructor() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems.next(JSON.parse(savedCart));
    }
  }

  toggleCart() {
    this.isOpen.next(!this.isOpen.value);
  }

  closeCart() {
    this.isOpen.next(false);
  }

  addToCart(product: any, size: number, color: string) {
    const currentCart = this.cartItems.value;
    const existingItem = currentCart.find(item =>
      item.id === product.id && item.size === size && item.color === color
    );

    if (existingItem) {
      existingItem.quantity++;
    } else {
      currentCart.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        image: product.images[0], 
        size: size,
        color: color,
        quantity: 1
      });
    }

    this.updateCart(currentCart);
  }

  removeFromCart(index: number) {
    const currentCart = this.cartItems.value;
    currentCart.splice(index, 1);
    this.updateCart(currentCart);
  }

  updateQuantity(index: number, quantity: number) {
    const currentCart = this.cartItems.value;
    if (quantity <= 0) {
      this.removeFromCart(index);
    } else {
      currentCart[index].quantity = quantity;
      this.updateCart(currentCart);
    }
  }

  getTotal() {
    return this.cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getCount() {
    return this.cartItems.value.reduce((sum, item) => sum + item.quantity, 0);
  }

  private updateCart(cart: CartItem[]) {
    this.cartItems.next([...cart]); 
    localStorage.setItem('cart', JSON.stringify(cart));
  }
}