import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { NavComponent } from './shared/nav/nav.component';
import { CommonModule } from '@angular/common';
import { ContactDataService } from './main-pages/shared-data/contact-data.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, NavComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  /**
   * The application title
   */
  title = 'join';
  
  /**
   * Controls the splash screen visibility
   */
  showSplashScreen = true;
  
  /**
   * Controls the logo animation state
   */
  logoAnimating = false;

  /**
   * Controls when to hide the animated logo and show the auth logo
   */
  animationComplete = false;

  /**
   * Controls whether to show the final normal logo on mobile
   */
  showFinalLogo = false;

  /**
   * Controls the crossfade between mobile logos
   */
  logoSwapping = false;

  /**
   * Detect if the device is mobile
   */
  get isMobile(): boolean {
    return window.innerWidth <= 768;
  }

  /**
   * Detect if we're on an auth route for mobile splash transition
   */
  get isOnAuthRoute(): boolean {
    const authRoutes = ['/auth', '/auth/login', '/auth/register'];
    return authRoutes.some(route => this.router.url.startsWith(route));
  }

  constructor(private router: Router,
    public contactDataService: ContactDataService
  ) {}

  ngOnInit() {
    // Start the splash screen animation
    this.startSplashAnimation();
  }

  /**
   * Starts the splash screen animation sequence
   */
  private startSplashAnimation() {
    setTimeout(() => {
      this.logoAnimating = true;
      
      if (this.isMobile) {
        setTimeout(() => {
          this.logoSwapping = true;
        }, 250);
        
        setTimeout(() => {
          this.showSplashScreen = false;
          this.animationComplete = true;
        }, 3500);
      } else {
        setTimeout(() => {
          this.showSplashScreen = false;
          this.animationComplete = true;
        }, 3500); 
      }
    }, 500);
  }

  /**
   * Determines whether the layout (NavBar and Header) should be displayed
   * based on the current route.
   * @returns true if NavBar and Header should be shown, false otherwise
   */
  shouldShowLayout(): boolean {
    const noLayoutRoutes = ['/', '/auth', '/auth/login', '/auth/register'];
    return !noLayoutRoutes.includes(this.router.url);
  }
}
