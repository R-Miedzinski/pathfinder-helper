import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const postDataGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const canAccess = authService.canPostData();

  if (!canAccess && !authService.isLoggedIn()) {
    router.navigate(['/log-in']);
  }

  return canAccess;
};
