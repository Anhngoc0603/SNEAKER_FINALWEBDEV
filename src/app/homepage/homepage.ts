import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-homepage',
  standalone: false,
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage {
    lastestProducts: Product[] = [];
    featuredProducts: Product[] = [];

    @ViewChild('contentWrapper') contentWrapper!: ElementRef;

    constructor() { }

    ngOnInit(): void {
        // Logic from main.js: renderLastestProducts (slice 0-4)
        this.lastestProducts = PRODUCTS.slice(0, 4);

        // Logic from main.js: renderFeaturedProducts (slice 3-7)
        this.featuredProducts = PRODUCTS.slice(3, 7);
    }

    ngAfterViewInit(): void {
        // Intersection Observer logic from main.js
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.3
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-active');
                    // observer.unobserve(entry.target); // Uncomment if needed
                }
            });
        }, options);

        if (this.contentWrapper) {
            observer.observe(this.contentWrapper.nativeElement);
        }
    }

    // Helper from data.js
    getDiscountPercentage(price: number, originalPrice: number): number {
        if (originalPrice <= price) return 0;
        return Math.round(((originalPrice - price) / originalPrice) * 100);
    }

    // Helper from data.js
    formatPrice(price: number): string {
        return `$${price.toFixed(2)}`;
    }

    // Helper from data.js (modified to return array for ngFor)
    generateStarRating(rating: number): string[] {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const stars = [];
        for (let i = 0; i < fullStars; i++) stars.push('full');
        if (hasHalfStar) stars.push('half');
        // Fill remaining with empty if needed, or handle in template
        return stars;
    }

    // Helper to get star character for template if using string approach
    getStarChar(type: string): string {
        return type === 'full' ? '★' : '☆';
    }

    quickAddToCart(id: number): void {
        const product = PRODUCTS.find(p => p.id === id);
        if (product) {
            console.log('Adding to cart:', product);
            // Implement cart logic or emit event
            // addToCart(product, product.sizes[0], product.colors[0]);
        }
        // event.stopPropagation() is handled in template
    }
}
