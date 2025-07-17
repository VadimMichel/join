import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

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
