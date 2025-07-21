import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

/**
 * Guard function to prevent access for authenticated users who are not guests.
 * Allows access only for unauthenticated users or guest users.
 * Redirects to the board if a regular authenticated user tries to access the route.
 *
 * @param route The activated route snapshot.
 * @param state The current router state snapshot.
 * @returns `true` if the user is unauthenticated or a guest; otherwise redirects and returns `false`.
 */
export const unauthGuard: CanActivateFn = (route, state) => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  if (!authenticationService.isAuthenticated() || authenticationService.isGuestUser()) {
    return true;
  } else {
    router.navigate(['/board']);
    return false;
  }
};
