import { EnvironmentInjector, inject, Injectable, runInInjectionContext } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  Auth,
  UserCredential,
  updateProfile,
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
        this.authStateSubject.next(true);
        this.currentUser = user;
      } else {
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
      console.error(error);
      throw new Error(this.handleFirebaseAuthError(error));
    }
  }
  // #endregion

  // #region Sign In
  async signIn(email: string, password: string): Promise<UserCredential> {
    try {
      const result: UserCredential = await runInInjectionContext(this.injector, () =>
        signInWithEmailAndPassword(this.auth, email, password)
      );
      return result;
    } catch (error: unknown) {
      console.error(error);
      throw new Error(this.handleFirebaseAuthError(error));
    }
  }

  async guestSignIn(): Promise<UserCredential> {
    try {
      return await runInInjectionContext(this.injector, () => signInAnonymously(this.auth));
    } catch (error) {
      console.error(error);
      throw new Error('Could not log-in anonymously');
    }
  }
  // #endregion

  // #region Update User Account

  async updateUserDisplayName(name: string): Promise<void> {
    if (this.auth.currentUser === null) return;
    try {
      return await runInInjectionContext(this.injector, () =>
        updateProfile(this.auth.currentUser!, { displayName: name })
      );
    } catch (error) {
      console.error(error);
      throw new Error('Could not update user data');
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

  private handleFirebaseAuthError(error: unknown): string {
    const err = error as { code?: string };

    switch (err.code) {
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/too-many-requests':
        return 'Too many failed login attempts. Please wait a moment and try again.';
      case 'auth/email-already-in-use':
        return 'This email address is already in use.';
      case 'auth/operation-not-allowed':
        return 'Email/password registration is currently disabled.';
      case 'auth/weak-password':
        return 'Your password is too weak. It must be at least 6 characters.';
      case 'auth/network-request-failed':
        return 'Network error – please check your internet connection.';
      case 'auth/internal-error':
        return 'An internal error occurred. Please try again later.';
      case 'auth/argument-error':
        return 'Invalid input. Please check your email and password.';
      case 'auth/popup-closed-by-user':
        return 'The sign-in popup was closed before completing the process.';
      case 'auth/cancelled-popup-request':
        return 'Another sign-in attempt is already in progress.';
      case 'auth/popup-blocked':
        return 'The sign-in popup was blocked by your browser.';
      default:
        console.warn('Unhandled Firebase Auth error:', error);
        return 'An unknown error occurred. Please try again.';
    }
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
