import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../auth/services/authentication.service';

/**
 * Start redirect component that handles initial routing based on authentication status
 * Redirects authenticated users to summary page, unauthenticated users to login
 */
@Component({
  selector: 'app-start-redirect',
  imports: [],
  template: ''
})
export class StartRedirectComponent implements OnInit {

  constructor(
    private router: Router, 
    private authenticationService: AuthenticationService
  ) {}

  /**
   * Initializes component and performs routing based on authentication status
   */
  ngOnInit(): void {
    this.redirectBasedOnAuthStatus();
  }

  /**
   * Redirects user based on their authentication status
   */
  private redirectBasedOnAuthStatus(): void {
    if (this.isUserAuthenticated()) {
      this.navigateToSummary();
    } else {
      this.navigateToLogin();
    }
  }

  /**
   * Checks if user is authenticated
   * @returns {boolean} True if user is authenticated
   */
  private isUserAuthenticated(): boolean {
    return this.authenticationService.isAuthenticated();
  }

  /**
   * Navigates to summary page
   */
  private navigateToSummary(): void {
    this.router.navigate(['/summary']);
  }

  /**
   * Navigates to login page
   */
  private navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
