import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, of, switchMap, tap } from 'rxjs';

export const postDataGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService
    .canPostData()
    .pipe(
      switchMap(canAccess => {
        if (!canAccess) {
          return authService
            .checkCookie()
            .pipe(map(data => data.role === 'ADMIN'));
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
