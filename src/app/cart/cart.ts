import { Component } from '@angular/core';
import { CartService } from './cart.service';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  
  constructor(public cartService: CartService) {}

  getColorName(hex: string): string {
    const colorMap: {[key: string]: string} = {
      '#000000': 'Black', '#ffffff': 'White', '#ef4444': 'Red',
      '#3b82f6': 'Blue', '#10b981': 'Green', '#f97316': 'Orange',
      '#9ca3af': 'Gray', '#92400e': 'Brown', '#a855f7': 'Purple',
      '#1e40af': 'Navy', '#f5f5dc': 'Cream'
    };
    return colorMap[hex.toLowerCase()] || 'Custom';
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }
}
