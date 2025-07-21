import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { ContactDataService } from '../../main-pages/shared-data/contact-data.service';

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
  errorMessage: string = ''; // Simon: Diese Message können wir dem User anzeigen, damit er weiß, was schiefgegangen ist. Z. B. "This email is already taken"
  showPassword: boolean = false;
  showPasswordConfirm: boolean = false;
  passwordInput: boolean = false;
  passwordInputConfirm: boolean = false;
  confirmPrivacyPolicy: boolean = false;
  manualChange: boolean = false;
  passwordDontMatch: boolean = false;
  // #endregion

  constructor(private authenticationService: AuthenticationService, 
    private router: Router,
    private contactDataService : ContactDataService
  ) {}

  // #region Auth Methods
  onSignUp() {
    if(this.doesPasswordMatch()){
      try {
        this.signUp();
        this.createNewContact(); 
        this.navigateToLoginAfterUserfeedback();      
        this.userFeedbackSuccess();
        this.passwordDontMatch = false;
      } catch (error) {
        this.userFeedbackError(error);
        this.passwordDontMatch = false;
      }
    }else{
      this.passwordDontMatch = true;
    }
  }
  // #endregion

  togglePasswordVisibility(input: 'showPassword' | 'showPasswordConfirm', inputElement: HTMLInputElement){
    if(this.isInputShowPassword(input)){
      this.togglePasswordImage(inputElement);
    }if(this.isInputPaswordComfirm(input)){
      this.togglePasswordConfirmImage(inputElement);
    }
  }

  onLinkHover(hovering: boolean) {
    if (!this.manualChange) {
      this.confirmprivacyPolicy = hovering;
    }
  }

  togleManualChange(){
    this.manualChange =!this.manualChange;
  }

  goBackToLogin(){
    this.router.navigateByUrl('/auth/login');
    this.contactDataService.signUpButtonVisible = true;
  }

  clearError(){
    setTimeout(() => {
      this.errorMessage = "";
    }, 4000);
  }

  isInputShowPassword(input: 'showPassword' | 'showPasswordConfirm'): boolean{
    return input == 'showPassword';
  }

  togglePasswordImage(inputElement: HTMLInputElement): void {
    this.showPassword = !this.showPassword;
    inputElement.focus();
  }

  isInputPaswordComfirm(input: 'showPassword' | 'showPasswordConfirm'): boolean{
    return input == 'showPasswordConfirm';
  }

  togglePasswordConfirmImage(inputElement: HTMLInputElement): void{
    this.showPasswordConfirm = !this.showPasswordConfirm;
    inputElement.focus();
  }

  doesPasswordMatch(): boolean{
    return this.confirmPassword === this.password;
  }

  async signUp(): Promise<void>{
    await this.authenticationService.signUp(this.email, this.password);
    await this.authenticationService.updateUserDisplayName(this.userName);
  }

  async createNewContact(): Promise<void>{
    await this.contactDataService.addContact(
      {
        name: this.userName,
        email: this.email,
        phone: "",
      }
    );
  }

  navigateToLoginAfterUserfeedback(): void {
    setTimeout(() => {
      this.router.navigateByUrl('/auth/login');
      this.contactDataService.signUpButtonVisible = true;
    }, 4000); 
  }

  userFeedbackSuccess(): void {
    this.errorMessage = "🎉 Signup successful!"
    this.clearError();
  }

  userFeedbackError(error: unknown):void {
    this.errorMessage = (error as Error).message;
    this.clearError();
  }
}