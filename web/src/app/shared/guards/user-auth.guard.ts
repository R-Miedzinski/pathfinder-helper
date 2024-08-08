import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const userAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const canAccess = authService.canPlay() && authService.isLoggedIn();

  if (!canAccess) {
    router.navigate(['/log-in']);
  }

  return canAccess;
};
