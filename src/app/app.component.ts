import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { NavComponent } from './shared/nav/nav.component';
import { CommonModule } from '@angular/common';

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

  constructor(private router: Router) {}

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
      
      setTimeout(() => {
        this.showSplashScreen = false;
        this.animationComplete = true;
      }, 2300);
    }, 1500);
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
