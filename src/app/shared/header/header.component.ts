import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../auth/services/authentication.service';
import { CommonModule } from '@angular/common';

/**
 * Header component that displays the main navigation header
 */
@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  isDropdownOpen = false;

  constructor(
    public authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
      if (!event.target || !(event.target as HTMLElement).closest('.avatar-container')) {
        this.isDropdownOpen = false;
      }
    });
  }

  get isLoggedIn(): boolean {
    if (this.authService.isRegularUser() || this.authService.isGuestUser()) {
      return true;
    }
    
    return false;
  }

  /**
   * Toggle the avatar dropdown menu
   */
  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  /**
   * Close the dropdown menu
   */
  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  /**
   * Navigate to help page and close dropdown
   */
  navigateToHelp(): void {
    this.router.navigate(['/help']);
    this.closeDropdown();
  }

  /**
   * Navigate to legal notice page and close dropdown
   */
  navigateToLegalNotice(): void {
    this.router.navigate(['/legal-notice']);
    this.closeDropdown();
  }

  /**
   * Navigate to privacy policy page and close dropdown
   */
  navigateToPrivacyPolicy(): void {
    this.router.navigate(['/privacy-policy']);
    this.closeDropdown();
  }

  /**
   * Logs out the current user and redirects to login page
   */
  async logout(): Promise<void> {
    try {
      localStorage.clear();
      sessionStorage.clear();
      
      await this.authService.logout();
      
      this.router.navigate(['/auth/login']);
      this.closeDropdown();
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.clear();
      sessionStorage.clear();
      this.router.navigate(['/auth/login']);
      this.closeDropdown();
    }
  }

  /**
   * Get user initials for avatar display
   */
  get userInitials(): string {
    const currentUser = this.authService.currentUser;
    if (currentUser?.displayName) {
      const names = currentUser.displayName.split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[1][0]).toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    return 'G';
  }
}
