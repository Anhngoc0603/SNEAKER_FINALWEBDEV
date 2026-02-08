import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/internal/operators/filter';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
    isMenuOpen = false;
    isScrolled = false;
    cartCount = 0;
    currentRoute = '';

    constructor(private router: Router) {
        // Track router events to set active link
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: NavigationEnd) => {
            this.currentRoute = event.urlAfterRedirects;
        });
    }

    ngOnInit(): void {
        // Initial check for cart or other initialization
    }

    @HostListener('window:scroll', [])
    onWindowScroll() {
        this.isScrolled = window.scrollY > 50;
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        if (window.innerWidth > 768 && this.isMenuOpen) {
            this.isMenuOpen = false;
            document.body.style.overflow = '';
        }
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        if (this.isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    closeMenu() {
        if (this.isMenuOpen) {
            this.isMenuOpen = false;
            document.body.style.overflow = '';
        }
    }

    isActive(route: string): boolean {
        if (route === '/' || route === '/home') {
            return this.currentRoute === '/' || this.currentRoute === '/home';
        }
        return this.currentRoute.startsWith(route);
    }
}
