import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CategoryInterface {
  id: number;
  nombre: string;
  activo: boolean;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private baseUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<CategoryInterface[]> {
    return this.http.get<CategoryInterface[]>(this.baseUrl);
  }

  findActive(): Observable<CategoryInterface[]> {
    return this.http.get<CategoryInterface[]>(`${this.baseUrl}/active`);
  }

  findById(id: number): Observable<CategoryInterface> {
    return this.http.get<CategoryInterface>(`${this.baseUrl}/${id}`);
  }

  create(data: { nombre: string; activo?: boolean }): Observable<CategoryInterface> {
    return this.http.post<CategoryInterface>(this.baseUrl, data);
  }

  update(id: number, data: { nombre?: string; activo?: boolean }): Observable<CategoryInterface> {
    return this.http.patch<CategoryInterface>(`${this.baseUrl}/${id}`, data);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
