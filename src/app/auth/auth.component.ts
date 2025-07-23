import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContactDataService } from '../main-pages/shared-data/contact-data.service';

@Component({
  selector: 'app-auth',
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent implements OnInit {
  /**
   * Controls the visibility of the logo animation on the login screen.
   */
  showLogo = false;

  /**
   * Determines whether the current device is considered mobile based on screen width.
   */
  get isMobile(): boolean {
    return window.innerWidth <= 768;
  }

  /**
   * Initializes the component and sets up periodic mobile detection.
   * @param contactDataService - Shared service for managing contact-related state.
   */
  constructor(public contactDataService: ContactDataService) {
    setInterval(() => {
      this.isMobile;
    }, 100);
  }

  /**
   * Triggers the logo animation after a short delay when the component initializes.
   */
  ngOnInit() {
    setTimeout(() => {
      this.showLogo = true;
    }, 1500);
  }
}
