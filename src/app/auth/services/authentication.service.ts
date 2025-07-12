import { Injectable } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  Auth,
  UserCredential,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {


  constructor(private auth: Auth) {}

  // #region SignUp & SignIn
  async signUp(
    email: string,
    password: string
  ): Promise<UserCredential> {
    try {
      return await createUserWithEmailAndPassword(this.auth, email, password);
    } catch (error: unknown) {
      console.error(error);
      throw error;
    }
  }

  async signIn(
    email: string,
    password: string
  ): Promise<UserCredential> {
    try {
      return await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error: unknown) {
      console.error(error);
      throw error;
    }
  }

  // #endregion
}
