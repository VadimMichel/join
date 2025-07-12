import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { NavComponent } from './shared/nav/nav.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, NavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  /**
   * The application title
   */
  title = 'join';

  constructor(private router: Router) {}

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
