import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService, CategoryInterface } from '../../../core/services/category.service';
import { ProductInterface } from '../../../core/interfaces/product.interface';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyFormatPipe],
  templateUrl: './admin.component.html',
  styleUrl: './admin-shared.css'
})
export class AdminComponent implements OnInit {
  products: ProductInterface[] = [];
  filteredProducts: ProductInterface[] = [];
  categories: CategoryInterface[] = [];
  editingProduct: Partial<ProductInterface> | null = null;
  selectedFile: File | null = null;
  apiUrl = environment.apiUrl;
  loading = false;
  error = '';
  isCreating = false;

  filterCategoryId: number | null = null;
  filterMaterial: string | null = null;
  searchQuery = '';

  materials = ['Plata925', 'Oro', 'Bañados en Plata', 'Acero Blanco', 'Acero Dorado', 'Acero Quirurgico', 'Otro'];

  constructor(
    public auth: AuthService,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
  ) {
    if (!auth.isLoggedIn()) {
      router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.productService.findAll().subscribe(data => {
      this.products = data;
      this.applyFilters();
    });
  }

  loadCategories(): void {
    this.categoryService.findAll().subscribe(data => {
      this.categories = data;
    });
  }

  applyFilters(): void {
    let result = this.products;

    if (this.filterCategoryId !== null) {
      result = result.filter(p => (p.categoriaId ?? p.categoria?.id) === this.filterCategoryId);
    }

    if (this.filterMaterial !== null) {
      result = result.filter(p => p.material === this.filterMaterial);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    this.filteredProducts = result;
  }

  clearFilters(): void {
    this.filterCategoryId = null;
    this.filterMaterial = null;
    this.searchQuery = '';
    this.applyFilters();
  }

  getImageUrl(product: ProductInterface): string {
    if (!product.imageUrl) return '/placeholder.svg';
    if (product.imageUrl.startsWith('http')) return product.imageUrl;
    return `${this.apiUrl}${product.imageUrl}`;
  }

  getCategoryName(product: ProductInterface): string {
    return product.categoria?.nombre || product.category || '';
  }

  startCreate(): void {
    const firstCatId = this.categories.length > 0 ? this.categories[0].id : undefined;
    this.editingProduct = { name: '', description: '', price: undefined, stock: undefined, categoriaId: firstCatId, material: this.materials[0] };
    this.selectedFile = null;
    this.isCreating = true;
    document.body.style.overflow = 'hidden';
  }

  startEdit(product: ProductInterface): void {
    this.editingProduct = {
      ...product,
      categoriaId: product.categoriaId ?? product.categoria?.id,
    };
    this.selectedFile = null;
    this.isCreating = false;
    document.body.style.overflow = 'hidden';
  }

  cancelEdit(): void {
    this.editingProduct = null;
    this.selectedFile = null;
    document.body.style.overflow = '';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] || null;
  }

  save(): void {
    const p = this.editingProduct;
    if (!p) {
      this.error = 'Completá todos los campos.';
      return;
    }

    if (this.isCreating) {
      if (!p.name || !p.description || !p.price || !p.categoriaId || !p.material) {
        this.error = 'Completá todos los campos.';
        return;
      }
    }

    this.loading = true;
    this.error = '';

    const saveData = (imageUrl?: string) => {
      const data: Partial<ProductInterface> = {
        name: p.name,
        description: p.description,
        price: p.price,
        stock: p.stock,
        categoriaId: Number(p.categoriaId),
        material: p.material,
        imageUrl: imageUrl ?? p.imageUrl ?? undefined,
      };

      const request = this.isCreating
        ? this.productService.create(data)
        : this.productService.update(p.id!, data);

      request.subscribe({
        next: () => {
          this.loading = false;
          this.editingProduct = null;
          this.selectedFile = null;
          this.loadProducts();
        },
        error: () => {
          this.loading = false;
          this.error = 'Error al guardar el producto.';
        }
      });
    };

    if (this.selectedFile) {
      this.productService.uploadImage(this.selectedFile).subscribe({
        next: (res) => saveData(res.imageUrl),
        error: () => saveData()
      });
    } else {
      saveData();
    }
  }

  deleteProduct(id: number): void {
    if (!confirm('¿Eliminar este producto?')) return;
    this.productService.delete(id).subscribe({
      next: () => this.loadProducts(),
      error: () => this.error = 'Error al eliminar.'
    });
  }

  logout(): void {
    this.auth.logout();
  }

  goToCategories(): void {
    this.router.navigate(['/admin/categories']);
  }
}
