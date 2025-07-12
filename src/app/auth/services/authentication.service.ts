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
        console.error("Can't create user ", error);
        throw new Error('This email is already taken');
      } else if (err.code === 'auth/invalid-email') {
        throw new Error('This email is invalid');
      } else {
        console.error("Can't create user ", error);
        throw new Error('Something went wrong');
      }
    }
  }
  // #endregion

  // #region Sign In
  async signIn(email: string, password: string): Promise<UserCredential> {
    try {
      return await runInInjectionContext(this.injector, () =>
        signInWithEmailAndPassword(this.auth, email, password)
      );
    } catch (error: unknown) {
      console.error(error);
      throw error;
    }
  }
  // #endregion
}
