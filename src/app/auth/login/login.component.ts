import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { Router, RouterModule } from '@angular/router';
import { ContactDataService } from '../../main-pages/shared-data/contact-data.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  // #region Properties
  passwordInput: boolean = false;
  emailInput: boolean = false;
  showPassword: boolean = false;
  passwordInputTest: string = '';
  emailInputTest: string = '';
  errorMessage: string = '';
  // #endregion

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    public contactDataService: ContactDataService
  ) {}

  togglePasswordVisibility(inputElement: HTMLInputElement) {
    this.showPassword = !this.showPassword;
    inputElement.focus();
  }

  preventBlur(event: MouseEvent) {
    event.preventDefault();
  }

  // #region Login

  async onLogin() {
    try {
      await this.authenticationService.signIn(
        this.emailInputTest,
        this.passwordInputTest
      );
      
      if (this.isMobile) {
        this.router.navigate(['/mobile-greeting']);
      } else {
        this.router.navigate(['/summary']);
      }
      
      this.contactDataService.notInLogIn = true;
    } catch (error) {
      this.errorMessage = (error as Error).message;
      this.clearError();
    }
  }

  async onGuestLogin() {
    try {
      await this.authenticationService.guestSignIn();
      
      if (this.isMobile) {
        this.router.navigate(['/mobile-greeting']);
      } else {
        this.router.navigate(['/summary']);
      }
      
      this.contactDataService.notInLogIn = true;
    } catch (error) {
      this.errorMessage = (error as Error).message;
      this.clearError();
    }
  }
  // #endregion

  /**
   * Check if device is mobile
   */
  get isMobile(): boolean {
    return window.innerWidth <= 768;
  }

  // #region Logout
  async onLogout() {
    try {
      await this.authenticationService.logout();
      this.router.navigate(['/auth/login']);
    } catch (error) {
      this.errorMessage = (error as Error).message;
     this.clearError();
    }
  }
  // #endregion

  clearError(){
    setTimeout(() => {
      this.errorMessage = "";
    }, 4000);
  }
}
