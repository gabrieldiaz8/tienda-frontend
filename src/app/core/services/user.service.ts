import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserInterface } from '../interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<UserInterface[]> {
    return this.http.get<UserInterface[]>(this.baseUrl);
  }

  findById(id: number): Observable<UserInterface> {
    return this.http.get<UserInterface>(`${this.baseUrl}/${id}`);
  }

  create(data: { name: string; surname: string; usuario: string; password: string; role?: string }): Observable<UserInterface> {
    return this.http.post<UserInterface>(this.baseUrl, data);
  }

  update(id: number, data: { name?: string; surname?: string; usuario?: string; password?: string; role?: string }): Observable<UserInterface> {
    return this.http.patch<UserInterface>(`${this.baseUrl}/${id}`, data);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
