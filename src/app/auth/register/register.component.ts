import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  // #region Properties
  userName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  confirmprivacyPolicy: boolean = false;
  errorMessage: string = '';
  // #endregion

  constructor(private authenticationService: AuthenticationService) {}

  // #region Auth Methods
  async createNewAccount() {
    try {
      await this.authenticationService.signUp(this.email, this.password);
    } catch (error) {
      this.errorMessage = (error as Error).message;
      console.log(this.errorMessage);
    }
  }
  // #endregion
}
