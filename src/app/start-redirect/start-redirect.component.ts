import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../auth/services/authentication.service';
import { first } from 'rxjs';

/**
 * Start Redirect Component
 *
 * Handles initial routing based on authentication status.
 * Redirects authenticated users to summary page, unauthenticated users to login.
 */
@Component({
  selector: 'app-start-redirect',
  imports: [],
  template: '',
})
export class StartRedirectComponent implements OnInit {
  /**
   * Creates an instance of StartRedirectComponent.
   * @param {Router} router - Angular router for navigation
   * @param {AuthenticationService} authenticationService - Service for authentication status
   */
  constructor(private router: Router, private authenticationService: AuthenticationService) {}

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
    this.authenticationService.authState$
      .pipe(first((val): val is boolean => val !== null))
      .subscribe((isAuthenticated) => {
        if (isAuthenticated) {
          this.navigateToSummary();
        } else {
          this.navigateToLogin();
        }
      });
  }

  /**
   * Checks if user is authenticated
   * @returns {boolean} True if user is authenticated
   */
  private isUserAuthenticated(): boolean | null {
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
