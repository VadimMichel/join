import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { RegisterComponent } from '../register/register.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RegisterComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  passwordInput: boolean = false;
  emailInput: boolean = false;
  showPassword: boolean = false;
  passwordInputTest : string = '';
  emailInputTest: string = '';
  errorMessage: string = ''; // Verwenden für Feedback an User

  constructor(private authenticationService: AuthenticationService, private router: Router) {}

  togglePasswordVisibility(inputElement: HTMLInputElement) {
  this.showPassword = !this.showPassword;
  inputElement.focus();
  }

  preventBlur(event: MouseEvent){
    event.preventDefault();
  }

  // testSignUp
  testSignUp() {
    this.authenticationService.signUp("me2@test.com", "baum12345")
  }

  // testSignIn
  testSignIn() {
    this.authenticationService.signIn("me@test.com", "baum1234")
  }

  // #region Login Methodes
  async onLogin() {
    try {
      await this.authenticationService.signIn(this.emailInputTest, this.passwordInputTest);
      this.router.navigate(['/board']); // Sobald vorhanden zu Summary navigieren
    } catch (error) {
          this.errorMessage = (error as Error).message;
    }
  }

  // #endregion
}
