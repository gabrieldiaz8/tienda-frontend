import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/public/home/home.component').then(m => m.HomeComponent) },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./features/public/login/login.component').then(m => m.LoginComponent) },
  { path: 'admin', loadComponent: () => import('./features/owner/admin/admin.component').then(m => m.AdminComponent) },
];
