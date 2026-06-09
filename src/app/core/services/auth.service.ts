import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginResponseInterface } from '../interfaces/login-response.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = `${environment.apiUrl}/auth`;

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {}

  login(usuario: string, password: string): Observable<LoginResponseInterface> {
    return this.http.post<LoginResponseInterface>(`${this.baseUrl}/login`, { usuario, password }).pipe(
      tap(response => {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('role', response.role);
      }),
      catchError(error => {
        const msg = error.error?.message || 'Error al iniciar sesión';
        return throwError(() => new Error(msg));
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    this.router.navigate(['/home']);
  }
}
