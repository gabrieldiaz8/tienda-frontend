import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { ProductInterface } from '../interfaces/product.interface';

export interface CartItem {
  product: ProductInterface;
  quantity: number;
}

const STORAGE_KEY = 'adira_cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSubject.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const items: CartItem[] = JSON.parse(stored);
        this.itemsSubject.next(items);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  private saveToStorage(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.itemsSubject.value));
  }

  addToCart(product: ProductInterface): void {
    const current = this.itemsSubject.value;
    const existing = current.find(item => item.product.id === product.id);
    if (existing) {
      if (existing.quantity < product.stock) {
        existing.quantity++;
        this.itemsSubject.next([...current]);
        this.saveToStorage();
      }
    } else {
      this.itemsSubject.next([...current, { product, quantity: 1 }]);
      this.saveToStorage();
    }
  }

  removeFromCart(productId: number): void {
    this.itemsSubject.next(
      this.itemsSubject.value.filter(item => item.product.id !== productId)
    );
    this.saveToStorage();
  }

  updateQuantity(productId: number, quantity: number): void {
    const current = this.itemsSubject.value;
    const item = current.find(i => i.product.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else if (quantity <= item.product.stock) {
        item.quantity = quantity;
        this.itemsSubject.next([...current]);
        this.saveToStorage();
      }
    }
  }

  clearCart(): void {
    this.itemsSubject.next([]);
    this.saveToStorage();
  }

  getCount(): Observable<number> {
    return this.items$.pipe(
      map(items => items.reduce((sum, item) => sum + item.quantity, 0))
    );
  }
}
