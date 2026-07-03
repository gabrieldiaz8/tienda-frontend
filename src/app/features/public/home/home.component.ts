import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../core/services/product.service';
import { ProductInterface } from '../../../core/interfaces/product.interface';
import { CartService } from '../../../core/services/cart.service';
import { ToastService } from '../../../core/services/toast.service';
import { ToastComponent } from '../../../shared/components/toast/toast.component';
import { environment } from '../../../../environments/environment';

interface Slide { title: string; subtitle: string; }

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('catalogoSection') catalogoSection!: ElementRef;
  @ViewChild('contactoSection') contactoSection!: ElementRef;

  products: ProductInterface[] = [];
  filteredProducts: ProductInterface[] = [];
  selectedCategory: string | null = null;
  selectedProduct: ProductInterface | null = null;
  apiUrl = environment.apiUrl;

  currentSlide = 0;
  slideInterval: any;

  contactForm = { name: '', message: '' };

  categories = ['Todas', 'Aros', 'Pulseras', 'Collares', 'Dijes', 'Anillos', 'Abridores', 'Accesorios', 'Invierno'];

  slides: Slide[] = [
    { title: 'Toda la tendencia', subtitle: 'Todo lo que necesitas para destacar.' },
    { title: 'Calidad al mejor precio', subtitle: 'Tus joyas de calidad a precios únicos.' },
    { title: 'Envíos a todo el país', subtitle: 'Joyas para ti, sin importar dónde estés.' },
  ];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.startSlider();
  }

  ngAfterViewInit(): void {
    this.listenForHash();
  }

  ngOnDestroy(): void {
    this.stopSlider();
  }

  loadProducts(): void {
    this.productService.findAll().subscribe(data => {
      this.products = data;
      this.filterProducts();
    });
  }

  filterProducts(): void {
    if (!this.selectedCategory || this.selectedCategory === 'Todas') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(
        p => p.category === this.selectedCategory
      );
    }
  }

  selectCategory(cat: string): void {
    this.selectedCategory = cat === this.selectedCategory && cat !== 'Todas' ? null : cat;
    if (cat === 'Todas') this.selectedCategory = null;
    this.filterProducts();
  }

  openModal(product: ProductInterface): void {
    this.selectedProduct = product;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.selectedProduct = null;
    document.body.style.overflow = '';
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  startSlider(): void {
    this.slideInterval = setInterval(() => this.nextSlide(), 5000);
  }

  stopSlider(): void {
    if (this.slideInterval) clearInterval(this.slideInterval);
  }

  listenForHash(): void {
    const check = () => {
      const hash = window.location.hash;
      if (hash === '#catalogo' && this.catalogoSection) {
        this.catalogoSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
      if (hash === '#contacto' && this.contactoSection) {
        this.contactoSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    };
    setTimeout(check, 300);
    window.addEventListener('hashchange', check);
  }

  addToCart(product: ProductInterface): void {
    this.cartService.addToCart(product);
    this.toastService.show(`${product.name} agregado al carrito`);
    this.closeModal();
  }

  encode(str: string): string {
    return encodeURIComponent(str);
  }

  getImageUrl(product: ProductInterface): string {
    if (!product.imageUrl) return '/placeholder.svg';
    if (product.imageUrl.startsWith('http')) return product.imageUrl;
    return `${this.apiUrl}${product.imageUrl}`;
  }
  
  submitContact(): void {
    const { name, message } = this.contactForm;
    const text = encodeURIComponent(`Hola, soy ${name}. ${message}`);
    window.open(`https://wa.me/5493534014165?text=${text}`, '_blank');
  }

  trackById(index: number, product: ProductInterface): number {
    return product.id;
  }
}
