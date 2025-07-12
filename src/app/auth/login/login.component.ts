import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  passwordInput: boolean = false;
  emailInput: boolean = false;
  showPassword: boolean = false;
  passwordInputTest : string = '';
  emailInputTest: string = '';

  constructor(private authenticationService: AuthenticationService) {}

  togglePasswordVisibility(inputElement: HTMLInputElement) {
  this.showPassword = !this.showPassword;
  inputElement.focus();
  }

  preventBlur(event: MouseEvent){
    event.preventDefault();
  }

  // testSignUp
  testSignUp() {
    this.authenticationService.signUp("me@test.com", "baum1234")
  }

  // testSignIn
  testSignIn() {
    this.authenticationService.signIn("me@test.com", "baum1234")
  }
}
