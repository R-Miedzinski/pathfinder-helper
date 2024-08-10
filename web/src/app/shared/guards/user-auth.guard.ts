import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { map, of, switchMap, tap } from 'rxjs';

export const userAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService
    .isLoggedIn()
    .pipe(
      switchMap(canAccess => {
        if (!canAccess) {
          return authService
            .checkCookie()
            .pipe(map(data => data.role === 'ADMIN' || data.role === 'USER'));
        } else {
          return of(true);
        }
      })
    )
    .pipe(
      tap(canAccess => {
        if (!canAccess) {
          router.navigate(['/log-in']);
        }
      })
    );
};
