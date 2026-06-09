import { Component, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  scrolled = false;
  menuOpen = false;

  constructor(
    public auth: AuthService,
    private router: Router,
  ) {}

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled = window.scrollY > 40;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  scrollTo(fragment: string) {
    this.router.navigate(['/home'], { fragment }).then(() => {
      const target = document.getElementById(fragment);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      this.closeMenu();
    });
  }

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  get role(): string | null {
    return this.auth.getRole();
  }

  logout() {
    this.auth.logout();
    this.closeMenu();
  }

  goToAdmin() {
    this.router.navigate(['/admin']);
    this.closeMenu();
  }
}
