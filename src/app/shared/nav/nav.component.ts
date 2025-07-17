import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../auth/services/authentication.service';
import { ContactDataService } from '../../main-pages/shared-data/contact-data.service';
import { CommonModule } from '@angular/common';

/**
 * Navigation component that displays the main application navigation menu
 */
@Component({
  selector: 'app-nav',
  imports: [RouterModule, CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {
  constructor(
    public authService: AuthenticationService,
    public contactDataService: ContactDataService,
    private router: Router
  ) {}

  /**
   * Check if user should see the full navigation
   * Guest users see simplified nav only on legal pages
   */
  get isLoggedIn(): boolean {
    if (this.authService.isRegularUser()) {
      return true;
    }
    
    if (this.authService.isGuestUser()) {
      const currentUrl = this.router.url;
      const isLegalPage = currentUrl.includes('/legal-notice') || currentUrl.includes('/privacy-policy');
      return !isLegalPage;
    }
    
    return false;
  }
}
