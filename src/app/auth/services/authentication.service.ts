import {
  EnvironmentInjector,
  inject,
  Injectable,
  runInInjectionContext,
} from '@angular/core';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  Auth,
  UserCredential,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  // #region Properties

  /**
   * Angular EnvironmentInjector for running code in the correct injection context.
   */
  private readonly injector = inject(EnvironmentInjector);

  private authStateSubject = new BehaviorSubject<boolean>(false);

  // #endregion

  constructor(private auth: Auth) {
    this.initAuthStateListener();
  }

  // #region Life Cycle
  initAuthStateListener(): void {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        console.log('Signed in user: ', user.email);
        this.authStateSubject.next(true);
      } else {
        console.log('No user signed in.');
        this.authStateSubject.next(false);
      }
    });
  }
  // #endregion

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
      return result;
    } catch (error: unknown) {
      console.error(error);
      throw new Error('Something went wrong');
    }
  }

  async guestSignIn(): Promise<UserCredential> {
    try {
      return await runInInjectionContext(this.injector, () =>
        signInAnonymously(this.auth)
      );
    } catch (error) {
      console.error(error);
      throw new Error('Could not log-in anonymously');
    }
  }
  // #endregion

  // #region Sign Out
  async logout(): Promise<void> {
    try {
      await runInInjectionContext(this.injector, () => signOut(this.auth));
    } catch (error) {
      console.error(error);
      throw new Error('Something went wrong');
    }
  }
  // #endregion

  // #region Helpers
  isAuthenticated(): boolean {
    return this.authStateSubject.value;
  }
  // #endregion
}
