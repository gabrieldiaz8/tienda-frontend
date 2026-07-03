import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastSubject = new BehaviorSubject<Toast | null>(null);
  toast$: Observable<Toast | null> = this.toastSubject.asObservable();

  show(message: string, type: Toast['type'] = 'success'): void {
    this.toastSubject.next({ message, type });
    setTimeout(() => this.toastSubject.next(null), 2500);
  }
}
