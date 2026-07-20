import { Pipe, PipeTransform } from '@angular/core';

export function formatCurrency(value: number | string | null | undefined): string {
  if (value == null) return '';
  const num = Number(value);
  if (!Number.isFinite(num)) return '';
  return '$' + num.toLocaleString('es-AR');
}

@Pipe({
  name: 'currencyFormat',
  standalone: true,
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number | string | null | undefined): string {
    return formatCurrency(value);
  }
}
