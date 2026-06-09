import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProductInterface } from '../interfaces/product.interface';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private baseUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<ProductInterface[]> {
    return this.http.get<ProductInterface[]>(this.baseUrl);
  }

  findById(id: number): Observable<ProductInterface> {
    return this.http.get<ProductInterface>(`${this.baseUrl}/${id}`);
  }

  findByCategory(category: string): Observable<ProductInterface[]> {
    return this.http.get<ProductInterface[]>(`${this.baseUrl}/category/${category}`);
  }

  findByMaterial(material: string): Observable<ProductInterface[]> {
    return this.http.get<ProductInterface[]>(`${this.baseUrl}/material/${material}`);
  }

  findByPriceRange(min: number, max: number): Observable<ProductInterface[]> {
    return this.http.get<ProductInterface[]>(`${this.baseUrl}/price-range?min=${min}&max=${max}`);
  }

  create(data: Partial<ProductInterface>): Observable<ProductInterface> {
    return this.http.post<ProductInterface>(this.baseUrl, data);
  }

  update(id: number, data: Partial<ProductInterface>): Observable<ProductInterface> {
    return this.http.patch<ProductInterface>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  uploadImage(file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<{ imageUrl: string }>(`${this.baseUrl}/upload`, formData);
  }
}
