import { Component, OnInit, AfterViewInit } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.html',
    styleUrl: './admin.css',
    standalone: false
})
export class Admin implements OnInit, AfterViewInit {
    currentView: string = 'dashboard';
    isSidebarOpen: boolean = false;
    isSidebarCollapsed: boolean = true; // Collapsed by default

    // Data
    products: any[] = [];
    orders: any[] = [];
    customers: any[] = [];
    refunds: any[] = [];

    // Modals
    showProductModal: boolean = false;
    showProductManageModal: boolean = false;
    showCustomerModal: boolean = false;

    selectedProduct: any = {};
    selectedCustomer: any = {};

    // Charts
    charts: any = { revenue: null, status: null, inventory: null };
    dashboardFilters = { range: '30d', group: 'day' };

    ngOnInit() {
        this.loadAll();
    }

    ngAfterViewInit() {
        this.renderDashboardCharts();
    }

    toggleSidebar() {
        if (window.innerWidth > 768) {
            this.isSidebarCollapsed = !this.isSidebarCollapsed;
        } else {
            this.isSidebarOpen = !this.isSidebarOpen;
        }
    }

    showView(viewId: string) {
        this.currentView = viewId;
        if (viewId === 'dashboard') {
            setTimeout(() => this.renderDashboardCharts(), 0);
        }
        if (window.innerWidth <= 768) {
            this.isSidebarOpen = false;
        }
    }

    // --- Data Loading (Mock) ---
    loadAll() {
        this.products = [
            { id: 1, name: 'Air Max 270', price: 150, brand: 'Nike', available: true, specs: 'Color: Red, Size: 42' },
            { id: 2, name: 'Ultra Boost', price: 180, brand: 'Adidas', available: true, specs: 'Color: Black, Size: 43' },
            { id: 3, name: 'Jordan 1 High', price: 200, brand: 'Jordan', available: false, specs: 'Color: Blue, Size: 41' }
        ];
        this.orders = [
            { id: 'ORD-001', customerName: 'John Doe', total: 330, status: 'Completed', eta: '2023-10-25' },
            { id: 'ORD-002', customerName: 'Jane Smith', total: 150, status: 'Processing', eta: '2023-10-28' }
        ];
        this.customers = [
            { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123456789' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '987654321' }
        ];
        this.refunds = [];
    }

    // --- Products ---
    openProductModal(id: any) {
        this.selectedProduct = this.products.find(p => p.id === id) || {};
        this.showProductModal = true;
    }
    closeModal() { this.showProductModal = false; }

    openProductManageModal(product: any = null) {
        this.selectedProduct = product ? { ...product } : {};
        this.showProductManageModal = true;
    }
    closeProductManageModal() { this.showProductManageModal = false; }

    saveProduct() {
        if (this.selectedProduct.id) {
            const index = this.products.findIndex(p => p.id === this.selectedProduct.id);
            if (index !== -1) this.products[index] = this.selectedProduct;
        } else {
            this.selectedProduct.id = this.products.length + 1;
            this.products.push(this.selectedProduct);
        }
        this.renderDashboardCharts(); // Update charts
        this.closeProductManageModal();
    }

    deleteProduct(id: any) {
        if (confirm('Delete this product?')) {
            this.products = this.products.filter(p => p.id !== id);
            this.renderDashboardCharts();
        }
    }

    // --- Customers ---
    openCustomerModal(customer: any = null) {
        this.selectedCustomer = customer ? { ...customer } : {};
        this.showCustomerModal = true;
    }
    closeCustomerModal() { this.showCustomerModal = false; }

    saveCustomer() {
        if (this.selectedCustomer.id) {
            const index = this.customers.findIndex(c => c.id === this.selectedCustomer.id);
            if (index !== -1) this.customers[index] = this.selectedCustomer;
        } else {
            this.selectedCustomer.id = this.customers.length + 1;
            this.customers.push(this.selectedCustomer);
        }
        this.closeCustomerModal();
    }

    // --- Charts ---
    renderDashboardCharts() {
        // Logic from user's JS adapted
        const revCanvas = document.getElementById("chartRevenue") as HTMLCanvasElement;
        const statusCanvas = document.getElementById("chartStatus") as HTMLCanvasElement;
        const invCanvas = document.getElementById("chartInventory") as HTMLCanvasElement;

        if (!revCanvas || !statusCanvas || !invCanvas) return;

        // Destroy old maps
        if (this.charts.revenue) this.charts.revenue.destroy();
        if (this.charts.status) this.charts.status.destroy();
        if (this.charts.inventory) this.charts.inventory.destroy();

        // 1. Revenue
        this.charts.revenue = new Chart(revCanvas, {
            type: "line",
            data: {
                labels: ['2023-10-01', '2023-10-05', '2023-10-10', '2023-10-15', '2023-10-20'],
                datasets: [{ label: "Revenue", data: [150, 300, 450, 200, 330], borderColor: "#f97316", backgroundColor: "rgba(249, 115, 22, 0.2)", tension: 0.25 }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });

        // 2. Status
        this.charts.status = new Chart(statusCanvas, {
            type: "doughnut",
            data: {
                labels: ['Completed', 'Processing', 'Cancelled'],
                datasets: [{ data: [1, 1, 0], backgroundColor: ["#10b981", "#f59e0b", "#ef4444"] }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });

        // 3. Inventory
        this.charts.inventory = new Chart(invCanvas, {
            type: "bar",
            data: {
                labels: ['Nike', 'Adidas', 'Jordan'],
                datasets: [{ label: "Inventory", data: [10, 5, 2], backgroundColor: "#f97316" }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }
}
