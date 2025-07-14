import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  passwordInput: boolean = false;
  emailInput: boolean = false;
  showPassword: boolean = false;
  passwordInputTest: string = '';
  emailInputTest: string = '';
  errorMessage: string = ''; // Verwenden für Feedback an User

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  togglePasswordVisibility(inputElement: HTMLInputElement) {
    this.showPassword = !this.showPassword;
    inputElement.focus();
  }

  preventBlur(event: MouseEvent) {
    event.preventDefault();
  }

  // #region Login Methodes
  testGuestLogin() {
    this.router.navigate(['/contacts']);
  }

  async onLogin() {
    try {
      await this.authenticationService.signIn(
        this.emailInputTest,
        this.passwordInputTest
      );
      this.router.navigate(['/board']); // Sobald vorhanden zu Summary navigieren
    } catch (error) {
      this.errorMessage = (error as Error).message;
    }
  }

  async guestLogin() {
    try {
      await this.authenticationService.signIn('guest@email.com', 'guest1234');
      this.router.navigate(['/board']); // Sobald vorhanden zu Summary navigieren
    } catch (error) {
      this.errorMessage = (error as Error).message;
    }
  }
  // #endregion
}
