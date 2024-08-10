import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userRole?: string = undefined;

  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document
  ) {}

  public login(
    username: string,
    password: string
  ): Observable<any /*{ username: string; role: string }*/> {
    const url = `${environment.apiUrl}/api/auth/login`;

    return this.http
      .post<any>(url, { username, password })
      .pipe(tap(data => (this.userRole = data?.role)));
  }

  public register(
    username: string,
    password: string,
    email: string,
    user_code: string
  ): Observable<any /*{ username: string; role: string }*/> {
    const url = `${environment.apiUrl}/api/auth/signup`;

    return this.http.post(url, { username, password, email, user_code });
  }

  public isLoggedIn(): Observable<boolean> {
    return of(!!this.userRole);
  }

  public canPlay(): Observable<boolean> {
    return of(this.userRole === 'USER' || this.userRole === 'ADMIN');
  }

  public canPostData(): Observable<boolean> {
    return of(this.userRole === 'ADMIN');
  }

  public checkCookie(): Observable<{ role: string }> {
    const cookie = this.document.cookie;

    const url = `${environment.apiUrl}/api/auth/check-token`;

    return this.http.get<{ role: string }>(url).pipe(
      tap(data => {
        console.log('cookie checked: ', data);
        this.userRole = data?.role;
      })
    );
  }
}
