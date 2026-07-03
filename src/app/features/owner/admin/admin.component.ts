import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ProductService } from '../../../core/services/product.service';
import { ProductInterface } from '../../../core/interfaces/product.interface';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  products: ProductInterface[] = [];
  editingProduct: Partial<ProductInterface> | null = null;
  selectedFile: File | null = null;
  apiUrl = environment.apiUrl;
  loading = false;
  error = '';
  isCreating = false;

  categories = ['Aros', 'Pulseras', 'Collares', 'Dijes', 'Anillos', 'Abridores', 'Accesorios', 'Invierno'];
  materials = ['Plata925', 'Oro', 'Bañados en Plata', 'Acero Blanco', 'Acero Dorado', 'Acero Quirurgico', 'Otro'];

  constructor(
    public auth: AuthService,
    private router: Router,
    private productService: ProductService,
  ) {
    if (!auth.isLoggedIn()) {
      router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.findAll().subscribe(data => {
      this.products = data;
    });
  }

  getImageUrl(product: ProductInterface): string {
    if (!product.imageUrl) return '/placeholder.svg';
    if (product.imageUrl.startsWith('http')) return product.imageUrl;
    return `${this.apiUrl}${product.imageUrl}`;
  }

  startCreate(): void {
    this.editingProduct = { name: '', description: '', price: 0, stock: 0, category: this.categories[0], material: this.materials[0] };
    this.selectedFile = null;
    this.isCreating = true;
  }

  startEdit(product: ProductInterface): void {
    this.editingProduct = { ...product };
    this.selectedFile = null;
    this.isCreating = false;
    setTimeout(() => {
      document.getElementById('edit-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] || null;
  }

  cancelEdit(): void {
    this.editingProduct = null;
    this.selectedFile = null;
  }

  save(): void {
    const p = this.editingProduct;
    if (!p) {
      this.error = 'Completá todos los campos.';
      return;
    }

    if (this.isCreating) {
      if (!p.name || !p.description || !p.price || !p.category || !p.material) {
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
        category: p.category,
        material: p.material,
        imageUrl: imageUrl ?? p.imageUrl ?? undefined,
      };

      if (!this.isCreating) {
        const parsedPrice = Number(p.price);
        if (Number.isFinite(parsedPrice)) {
          data.price = parsedPrice;
        }
      }

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
}
