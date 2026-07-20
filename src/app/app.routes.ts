import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/public/home/home.component').then(m => m.HomeComponent) },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./features/public/login/login.component').then(m => m.LoginComponent) },
  { path: 'admin', loadComponent: () => import('./features/owner/admin/admin.component').then(m => m.AdminComponent) },
  { path: 'admin/categories', loadComponent: () => import('./features/owner/categories/categories.component').then(m => m.CategoriesComponent) },
  { path: 'admin/users', loadComponent: () => import('./features/owner/users/users.component').then(m => m.UsersComponent) },
  { path: 'carrito', loadComponent: () => import('./features/public/cart/cart.component').then(m => m.CartComponent) },
];
