import {
  EnvironmentInjector,
  inject,
  Injectable,
  runInInjectionContext,
} from '@angular/core';
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
  // #region Properties

  /**
   * Angular EnvironmentInjector for running code in the correct injection context.
   */
  private readonly injector = inject(EnvironmentInjector);

  private isLoggedIn: boolean = false;
  // #endregion

  constructor(private auth: Auth) {}

  // #region Sign Up
  async signUp(email: string, password: string): Promise<UserCredential> {
    try {
      return await runInInjectionContext(this.injector, () =>
        createUserWithEmailAndPassword(this.auth, email, password)
      );
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      if (err.code === 'auth/email-already-in-use') {
        console.error(error);
        throw new Error('This email is already taken');
      } else if (err.code === 'auth/invalid-email') {
        console.error(error);
        throw new Error('This email is invalid');
      } else if (err.code === 'auth/network-request-failed') {
        console.error(error);
        throw new Error(
          'Network error. Please check your internet connection and try again.'
        );
      } else {
        console.error(error);
        throw new Error('Something went wrong');
      }
    }
  }
  // #endregion

  // #region Sign In
  async signIn(email: string, password: string): Promise<UserCredential> {
    try {
      const result: UserCredential = await runInInjectionContext(
        this.injector,
        () => signInWithEmailAndPassword(this.auth, email, password)
      );
      this.isLoggedIn = true;
      return result;
    } catch (error: unknown) {
      this.isLoggedIn = false;
      console.error(error);
      throw new Error('Something went wrong');
    }
  }

  // #endregion

  // #region Log Out
  testLogOut() {
    this.isLoggedIn = false;
  }
  // #endregion

  // #region Helpers
  isAuthenticated() {
    return this.isLoggedIn;
  }
  // #endregion
}
