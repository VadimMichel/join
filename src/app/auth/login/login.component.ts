import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { Router, RouterModule } from '@angular/router';
import { ContactDataService } from '../../main-pages/shared-data/contact-data.service';

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
  errorMessage: string = ''; // Simon: Verwenden für Feedback an User
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
      this.router.navigate(['/summary']); // Simon: Sobald vorhanden zu Summary navigieren
      this.contactDataService.notInLogIn = true;
    } catch (error) {
      this.errorMessage = (error as Error).message;
    }
  }

  async onGuestLogin() {
    try {
      await this.authenticationService.guestSignIn();
      this.router.navigate(['/summary']); // Simon: Sobald vorhanden zu Summary navigieren
      this.contactDataService.notInLogIn = true;
    } catch (error) {
      this.errorMessage = (error as Error).message;
    }
  }
  // #endregion

  // #region Logout
  async onLogout() {
    try {
      await this.authenticationService.logout();
      this.router.navigate(['/auth/login']);
    } catch (error) {
      this.errorMessage = (error as Error).message;
    }
  }
  // #endregion
}
