import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CategoryService, CategoryInterface } from '../../../core/services/category.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrl: '../admin/admin-shared.css',
})
export class CategoriesComponent implements OnInit {
  categories: CategoryInterface[] = [];
  editingCategory: Partial<CategoryInterface> | null = null;
  isCreating = false;
  loading = false;
  error = '';

  constructor(
    public auth: AuthService,
    private router: Router,
    private categoryService: CategoryService,
  ) {
    if (!auth.isLoggedIn()) {
      router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.findAll().subscribe(data => {
      this.categories = data;
    });
  }

  startCreate(): void {
    this.editingCategory = { nombre: '', activo: true };
    this.isCreating = true;
  }

  startEdit(cat: CategoryInterface): void {
    this.editingCategory = { ...cat };
    this.isCreating = false;
  }

  cancelEdit(): void {
    this.editingCategory = null;
  }

  save(): void {
    const c = this.editingCategory;
    if (!c || !c.nombre) {
      this.error = 'Completá el nombre de la categoría.';
      return;
    }

    this.loading = true;
    this.error = '';

    const request = this.isCreating
      ? this.categoryService.create({ nombre: c.nombre, activo: c.activo })
      : this.categoryService.update(c.id!, { nombre: c.nombre, activo: c.activo });

    request.subscribe({
      next: () => {
        this.loading = false;
        this.editingCategory = null;
        this.loadCategories();
      },
      error: () => {
        this.loading = false;
        this.error = 'Error al guardar la categoría.';
      },
    });
  }

  deleteCategory(id: number): void {
    if (!confirm('¿Eliminar esta categoría? Los productos asociados quedarán sin categoría.')) return;
    this.categoryService.remove(id).subscribe({
      next: () => this.loadCategories(),
      error: () => (this.error = 'Error al eliminar.'),
    });
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }
}
