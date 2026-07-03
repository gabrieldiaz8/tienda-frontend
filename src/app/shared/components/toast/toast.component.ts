import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (toastService.toast$ | async; as toast) {
      <div class="toast toast-{{ toast.type }}">
        {{ toast.message }}
      </div>
    }
  `,
  styles: [`
    .toast {
      position: fixed; bottom: 24px; right: 24px; z-index: 9999;
      padding: 14px 28px; border-radius: 8px; font-size: 15px;
      font-weight: 500; color: #fff; box-shadow: 0 4px 20px rgba(0,0,0,.2);
      animation: fadeInUp .35s ease;
    }
    .toast-success { background: #28a745; }
    .toast-error   { background: #dc3545; }
    .toast-info    { background: #007bff; }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}
