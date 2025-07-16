import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { NavComponent } from './shared/nav/nav.component';
import { CommonModule } from '@angular/common';
import { ContactDataService } from './main-pages/shared-data/contact-data.service';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, NavComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
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
   * Subscription to router events
   */
  private routerSubscription: Subscription = new Subscription();

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

  /**
   * Check if we're specifically on the login page
   */
  get isOnLoginPage(): boolean {
    return this.router.url === '/' || this.router.url === '/auth/login';
  }

  constructor(private router: Router,
    public contactDataService: ContactDataService
  ) {}

  ngOnInit() {
    this.checkAndStartAnimation();
    
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkAndStartAnimation();
      });
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

  /**
   * Checks if we're on login page and starts animation
   */
  private checkAndStartAnimation() {
    if (this.isOnLoginPage) {
      this.showSplashScreen = true;
      this.logoAnimating = false;
      this.animationComplete = false;
      this.logoSwapping = false;
      
      this.startSplashAnimation();
    } else {
      this.showSplashScreen = false;
      this.animationComplete = true;
    }
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
        }, 375); 
        
        setTimeout(() => {
          this.showSplashScreen = false;
          this.animationComplete = true;
        }, 5500);
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
