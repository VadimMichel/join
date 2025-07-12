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
  errorMessage: string = ''; // Diese Message können wir dem User anzeigen, damit er weiß, was schiefgegangen ist. Z. B. "This email is already taken"
  // #endregion

  constructor(private authenticationService: AuthenticationService) {}

  // #region Auth Methods
  async createNewAccount() {
    try {
      await this.authenticationService.signUp(this.email, this.password);
    } catch (error) {
      this.errorMessage = (error as Error).message;
      console.log(this.errorMessage); // Nur für Testzwecke hier. Kann entfernt werden, sobald Toast-Message oder ähnliches für User funktioniert
    }
  }
  // #endregion
}
