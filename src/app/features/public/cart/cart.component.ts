import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { CartService, CartItem } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  private cartService = inject(CartService);
  private http = inject(HttpClient);

  items$ = this.cartService.items$;
  paymentMethod: string = 'Efectivo';
  customerName: string = '';
  submitting = false;

  get items(): CartItem[] {
    return this.cartService['itemsSubject'].value;
  }

  get total(): number {
    return this.items.reduce((t, i) => t + i.product.price * i.quantity, 0);
  }

  updateQuantity(item: CartItem, qty: number): void {
    this.cartService.updateQuantity(item.product.id, qty);
  }

  remove(item: CartItem): void {
    this.cartService.removeFromCart(item.product.id);
  }

  submitOrder(): void {
    this.submitting = true;
    const items = this.items;
    const body = {
      items: items.map(i => ({ productId: i.product.id, quantity: i.quantity })),
      paymentMethod: this.paymentMethod,
      customerName: this.customerName || undefined,
    };

    this.http.post<any>(`${environment.apiUrl}/orders`, body).subscribe({
      next: (order) => {
        const lines = items.map(
          i => `- ${i.product.name} x${i.quantity} — $${(i.product.price * i.quantity).toLocaleString('es-AR')}`
        ).join('\n');
        const mensaje =
          `Hola! Realicé el pedido ${order.code} y quiero abonar.\n\n` +
          `Forma de pago: ${this.paymentMethod}\n\n` +
          `Productos:\n${lines}\n\n` +
          `Total: $${this.total.toLocaleString('es-AR')}`;

        window.open(
          `https://wa.me/${environment.whatsappNumber}?text=${encodeURIComponent(mensaje)}`,
          '_blank'
        );
        this.cartService.clearCart();
        this.submitting = false;
      },
      error: () => {
        this.submitting = false;
      },
    });
  }
}
