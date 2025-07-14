import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { RegisterComponent } from '../register/register.component';
import { Router, RouterModule } from '@angular/router';
import { ContactDataService } from '../../main-pages/shared-data/contact-data.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RegisterComponent, RouterModule],
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

  testGuestLogin() {
    this.router.navigate(['/contacts']);
    this.contactDataService.notInLogIn = true;
  }

  // #region Login Methodes
  async onLogin() {
    try {
      await this.authenticationService.signIn(
        this.emailInputTest,
        this.passwordInputTest
      );
      this.router.navigate(['/board']); // Sobald vorhanden zu Summary navigieren
      this.contactDataService.notInLogIn = true;
    } catch (error) {
      this.errorMessage = (error as Error).message;
    }
  }
  // #endregion
}
