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
    isSidebarCollapsed: boolean = true;

    // Data
    products: any[] = [];
    orders: any[] = [];
    customers: any[] = [];
    refunds: any[] = [];
    categories: any[] = [];

    // Modals
    showProductModal: boolean = false;
    showProductManageModal: boolean = false;
    showCustomerModal: boolean = false;

    selectedProduct: any = {};
    selectedCustomer: any = {};

    // Charts
    charts: any = { revenue: null, status: null, inventory: null };
    dashboardFilters = { range: '30d', group: 'day' };

    // API Config
    private API_BASE = (window as any).ADMIN_API_BASE || "".replace(/\/$/, "");

    ngOnInit() {
        this.loadAll();
    }

    ngAfterViewInit() {
        // Defer chart rendering to ensure DOM is ready
        setTimeout(() => this.renderDashboardCharts(), 100);
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

    // --- Data Loading ---
    async loadAll() {
        try {
            const [p, o, c, cat] = await Promise.all([
                this.ProductsAPI.list(),
                this.OrdersAPI.list(),
                this.CustomersAPI.list(),
                this.CategoriesAPI.list()
            ]);

            this.products = this.normalizeProducts(p);
            this.orders = o; // Add normalization if needed
            this.customers = c;
            this.categories = this.normalizeCategories(cat || []);

            // If data is empty (API & JSON failed), use hardcoded fallbacks for demo
            if (this.products.length === 0) this.loadHardcodedFallbacks();

            // Render charts after data update
            if (this.currentView === 'dashboard') {
                setTimeout(() => this.renderDashboardCharts(), 0);
            }
        } catch (error) {
            console.warn('Data load failed, using fallbacks', error);
            this.loadHardcodedFallbacks();
        }
    }

    loadHardcodedFallbacks() {
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
        this.renderDashboardCharts();
    }

    // --- API Helpers ---
    private async apiFetch(path: string, { method = "GET", data, headers }: any = {}) {
        const url = `${this.API_BASE}${path}`;
        const opts: any = { method, headers: { "Accept": "application/json", ...(headers || {}) } };
        if (data) {
            opts.headers["Content-Type"] = "application/json";
            opts.body = JSON.stringify(data);
        }
        const res = await fetch(url, opts);
        if (!res.ok) throw new Error(`${method} ${path} failed: ${res.status}`);
        const ct = res.headers.get("content-type") || "";
        return ct.includes("application/json") ? res.json() : res.text();
    }

    private async safeJson(url: string, def: any = []) {
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error("not ok");
            return await res.json();
        } catch { return def; }
    }

    private normalizeProducts(res: any) {
        if (Array.isArray(res)) return res;
        if (res && Array.isArray(res.products)) return res.products;
        if (res && Array.isArray(res.items)) return res.items;
        return [];
    }

    private normalizeCategories(res: any) {
        if (Array.isArray(res) && res.length > 0) return res;
        if (res && Array.isArray(res.categories)) return res.categories;

        // Derive from products if categories missing
        if (this.products.length > 0) {
            const map = new Map();
            for (const p of this.products) {
                const name = (p.brand || "Uncategorized").trim(); // Using brand as category fallback
                if (!map.has(name)) {
                    map.set(name, { id: name, name, description: "", tags: [] });
                }
            }
            return Array.from(map.values());
        }
        return [];
    }

    // --- API Wrappers ---
    ProductsAPI = {
        list: () => this.apiFetch("/api/products").catch(() => this.safeJson("/data/products.json", [])),
        create: (data: any) => this.apiFetch("/api/products", { method: "POST", data }),
        update: (id: any, data: any) => this.apiFetch(`/api/products/${id}`, { method: "PUT", data }),
        remove: (id: any) => this.apiFetch(`/api/products/${id}`, { method: "DELETE" })
    };

    OrdersAPI = {
        list: () => this.apiFetch("/api/orders").catch(() => this.safeJson("/data/orders.json", [])),
        updateStatus: (id: any, status: string) => this.apiFetch(`/api/orders/${id}`, { method: "PUT", data: { status } })
    };

    CustomersAPI = {
        list: () => this.apiFetch("/api/customers").catch(() => this.safeJson("/data/customers.json", [])),
        create: (data: any) => this.apiFetch("/api/customers", { method: "POST", data }),
        update: (id: any, data: any) => this.apiFetch(`/api/customers/${id}`, { method: "PUT", data }),
        remove: (id: any) => this.apiFetch(`/api/customers/${id}`, { method: "DELETE" })
    };

    CategoriesAPI = {
        list: () => this.apiFetch("/api/categories").catch(() => this.safeJson("/categories/full.json", []))
    };


    // --- Products Interactions ---
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

    async saveProduct() {
        if (this.selectedProduct.id) {
            // Try API, fallback to local
            try {
                await this.ProductsAPI.update(this.selectedProduct.id, this.selectedProduct);
            } catch (e) { console.warn("API update failed, updating local state", e); }

            const index = this.products.findIndex(p => p.id === this.selectedProduct.id);
            if (index !== -1) this.products[index] = { ...this.selectedProduct };
        } else {
            try {
                await this.ProductsAPI.create(this.selectedProduct);
            } catch (e) { console.warn("API create failed, updating local state", e); }

            this.selectedProduct.id = this.products.length + 1; // Fake ID
            this.products.push({ ...this.selectedProduct });
        }
        this.renderDashboardCharts();
        this.closeProductManageModal();
    }

    async deleteProduct(id: any) {
        if (confirm('Delete this product?')) {
            try {
                await this.ProductsAPI.remove(id);
            } catch (e) { console.warn("API delete failed, updating local state", e); }

            this.products = this.products.filter(p => p.id !== id);
            this.renderDashboardCharts();
        }
    }

    // --- Customers Interactions ---
    openCustomerModal(customer: any = null) {
        this.selectedCustomer = customer ? { ...customer } : {};
        this.showCustomerModal = true;
    }
    closeCustomerModal() { this.showCustomerModal = false; }

    async saveCustomer() {
        if (this.selectedCustomer.id) {
            try {
                await this.CustomersAPI.update(this.selectedCustomer.id, this.selectedCustomer);
            } catch (e) { console.warn("API update failed, updating local state", e); }

            const index = this.customers.findIndex(c => c.id === this.selectedCustomer.id);
            if (index !== -1) this.customers[index] = { ...this.selectedCustomer };
        } else {
            try {
                await this.CustomersAPI.create(this.selectedCustomer);
            } catch (e) { console.warn("API create failed, updating local state", e); }

            this.selectedCustomer.id = this.customers.length + 1;
            this.customers.push({ ...this.selectedCustomer });
        }
        this.closeCustomerModal();
    }

    // --- Charts ---
    renderDashboardCharts() {
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
        // Count statuses
        const pending = this.orders.filter(o => o.status === 'Processing').length;
        const completed = this.orders.filter(o => o.status === 'Completed').length;
        const cancelled = this.orders.filter(o => o.status === 'Cancelled').length;

        this.charts.status = new Chart(statusCanvas, {
            type: "doughnut",
            data: {
                labels: ['Completed', 'Processing', 'Cancelled'],
                datasets: [{ data: [completed, pending, cancelled], backgroundColor: ["#10b981", "#f59e0b", "#ef4444"] }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });

        // 3. Inventory
        // Group by brand
        const brands: any = {};
        this.products.forEach(p => {
            const b = p.brand || 'Other';
            brands[b] = (brands[b] || 0) + 1;
        });

        this.charts.inventory = new Chart(invCanvas, {
            type: "bar",
            data: {
                labels: Object.keys(brands),
                datasets: [{ label: "Inventory", data: Object.values(brands), backgroundColor: "#f97316" }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }
}
