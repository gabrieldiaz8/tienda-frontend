import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface MaterialInterface {
  id: number;
  nombre: string;
  activo: boolean;
  orden: number;
}

@Injectable({ providedIn: 'root' })
export class MaterialService {
  private baseUrl = `${environment.apiUrl}/materials`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<MaterialInterface[]> {
    return this.http.get<MaterialInterface[]>(this.baseUrl);
  }

  findActive(): Observable<MaterialInterface[]> {
    return this.http.get<MaterialInterface[]>(`${this.baseUrl}/active`);
  }

  findById(id: number): Observable<MaterialInterface> {
    return this.http.get<MaterialInterface>(`${this.baseUrl}/${id}`);
  }
}
