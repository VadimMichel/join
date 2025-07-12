import { Injectable } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  Auth,
  UserCredential,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private auth: Auth) {}

  // #region SignUp
  async signUp(
    email: string,
    password: string
  ): Promise<UserCredential | void> {
    try {
      return await createUserWithEmailAndPassword(this.auth, email, password);
    } catch (error: unknown) {
      console.error(error);
      throw error;      
    }
  }

  // #endregion
}
