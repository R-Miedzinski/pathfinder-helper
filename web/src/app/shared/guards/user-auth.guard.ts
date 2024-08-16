import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { UserRole } from 'rpg-app-shared-package/dist/public-api';

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
            .pipe(
              map(
                data =>
                  data.role === UserRole.ADMIN || data.role === UserRole.USER
              )
            );
        } else {
          return of(true);
        }
      }),
      catchError(() => of(false))
    )
    .pipe(
      tap(canAccess => {
        if (!canAccess) {
          router.navigate(['/log-in']);
        }
      })
    );
};
