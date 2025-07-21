import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { first, map } from 'rxjs';

/**
 * Guard function to protect routes from unauthorized access.
 * Redirects to the login page if the user is not authenticated.
 *
 * @param route The activated route snapshot.
 * @param state The current router state snapshot.
 * @returns `true` if the user is authenticated, otherwise redirects and returns `false`.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  return authenticationService.authState$.pipe(
    first((val): val is boolean => val !== null),
    map((isAuthenticated) => {
      if (isAuthenticated) {
        return true;
      } else {
        router.navigate(['/auth/login']);
        return false;
      }
    })
  );
};
