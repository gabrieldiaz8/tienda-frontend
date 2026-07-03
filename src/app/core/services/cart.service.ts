import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { ProductInterface } from '../interfaces/product.interface';

export interface CartItem {
  product: ProductInterface;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSubject.asObservable();

  addToCart(product: ProductInterface): void {
    const current = this.itemsSubject.value;
    const existing = current.find(item => item.product.id === product.id);
    if (existing) {
      if (existing.quantity < product.stock) {
        existing.quantity++;
        this.itemsSubject.next([...current]);
      }
    } else {
      this.itemsSubject.next([...current, { product, quantity: 1 }]);
    }
  }

  removeFromCart(productId: number): void {
    this.itemsSubject.next(
      this.itemsSubject.value.filter(item => item.product.id !== productId)
    );
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
      }
    }
  }

  clearCart(): void {
    this.itemsSubject.next([]);
  }

  getCount(): Observable<number> {
    return this.items$.pipe(
      map(items => items.reduce((sum, item) => sum + item.quantity, 0))
    );
  }
}
