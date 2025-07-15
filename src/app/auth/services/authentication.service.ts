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
import { onAuthStateChanged, signInAnonymously, User } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  // #region Properties

  /**
   * Angular EnvironmentInjector used to run asynchronous operations
   * within the correct injection context.
   */
  private readonly injector = inject(EnvironmentInjector);

  /**
   * Emits the current authentication state of the user.
   * `true` if a user is signed in, `false` otherwise.
   */
  private authStateSubject = new BehaviorSubject<boolean>(false);
  // #endregion

  currentUser: User | null = null;

  /**
   * Creates an instance of the AuthenticationService and triggers the setup of the authentication state listener.
   *
   * @param auth The Firebase Auth instance injected via Angular's DI.
   */
  constructor(private auth: Auth) {
    this.initAuthStateListener();
  }

  // #region Initialization
  initAuthStateListener(): void {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        console.log('Signed in user (null = guest): ', user.email);
        this.authStateSubject.next(true);
        this.currentUser = user;
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

  // #region State & Access
  isAuthenticated(): boolean {
    return this.authStateSubject.value;
  }

  /**
   * Check if the current user is a guest (anonymous) user
   */
  isGuestUser(): boolean {
    return this.auth.currentUser?.isAnonymous ?? false;
  }

  /**
   * Check if the current user is a regular (non-anonymous) user
   */
  isRegularUser(): boolean {
    return this.isAuthenticated() && !this.isGuestUser();
  }

  isEmailOfCurrentUser(email: string): boolean {
    if (this.currentUser !== null) {
      return email === this.currentUser.email;
    } else {
      return false;
    }
  }
  // #endregion
}
