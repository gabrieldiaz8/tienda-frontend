import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { UserInterface } from '../../../core/interfaces/user.interface';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: '../admin/admin-shared.css',
})
export class UsersComponent implements OnInit {
  users: UserInterface[] = [];
  editingUser: Partial<UserInterface & { password?: string }> | null = null;
  isCreating = false;
  loading = false;
  error = '';

  roles = ['OWNER', 'SUPER_ADMIN'];

  constructor(
    public auth: AuthService,
    private router: Router,
    private userService: UserService,
  ) {
    if (!auth.isLoggedIn()) {
      router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.findAll().subscribe(data => {
      this.users = data;
    });
  }

  startCreate(): void {
    this.editingUser = { name: '', surname: '', usuario: '', password: '', role: 'OWNER' };
    this.isCreating = true;
  }

  startEdit(user: UserInterface): void {
    this.editingUser = { ...user, password: '' };
    this.isCreating = false;
  }

  cancelEdit(): void {
    this.editingUser = null;
  }

  save(): void {
    const u = this.editingUser;
    if (!u || !u.name || !u.surname || !u.usuario) {
      this.error = 'Completá todos los campos obligatorios.';
      return;
    }

    if (this.isCreating && !u.password) {
      this.error = 'La contraseña es obligatoria.';
      return;
    }

    this.loading = true;
    this.error = '';

    const request = this.isCreating
      ? this.userService.create({ name: u.name, surname: u.surname, usuario: u.usuario, password: u.password!, role: u.role })
      : this.userService.update(u.id!, { name: u.name, surname: u.surname, usuario: u.usuario, password: u.password || undefined, role: u.role });

    request.subscribe({
      next: () => {
        this.loading = false;
        this.editingUser = null;
        this.loadUsers();
      },
      error: () => {
        this.loading = false;
        this.error = 'Error al guardar el usuario.';
      },
    });
  }

  deleteUser(id: number): void {
    if (!confirm('¿Eliminar este usuario?')) return;
    this.userService.remove(id).subscribe({
      next: () => this.loadUsers(),
      error: () => (this.error = 'Error al eliminar.'),
    });
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }
}
