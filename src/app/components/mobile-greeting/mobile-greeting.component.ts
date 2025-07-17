import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../../auth/services/authentication.service';

@Component({
  selector: 'app-mobile-greeting',
  imports: [CommonModule],
  templateUrl: './mobile-greeting.component.html',
  styleUrl: './mobile-greeting.component.scss'
})
export class MobileGreetingComponent implements OnInit {

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.router.navigate(['/summary']);
    }, 2500);
  }

  /**
   * Get greeting message based on time of day
   */
  getGreetingMessage(): string {
    const now: Date = new Date();
    const hours: number = Number(String(now.getHours()).padStart(2, '0'));
    const commaOrEmpty: string = this.getUserName() ? ',' : '';

    if (hours <= 5) {
      return 'Good night' + commaOrEmpty;
    } else if (hours <= 12) {
      return 'Good morning' + commaOrEmpty;
    } else if (hours <= 18) {
      return 'Good afternoon' + commaOrEmpty;
    } else {
      return 'Good evening' + commaOrEmpty;
    }
  }

  /**
   * Get user name - returns empty string for guest users
   */
  getUserName(): string {
    if (this.authenticationService.isGuestUser()) {
      return '';
    }
    
    if (!this.authenticationService.currentUser) return '';
    const userName: string = this.authenticationService.currentUser.displayName ?? '';
    return userName;
  }

  /**
   * Check if device is mobile
   */
  get isMobile(): boolean {
    return window.innerWidth <= 768;
  }
}
