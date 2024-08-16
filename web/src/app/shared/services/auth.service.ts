import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserRole } from 'rpg-app-shared-package/dist/public-api';
import { Observable, tap, map, ReplaySubject, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userRole: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(private http: HttpClient) {}

  public login(
    username: string,
    password: string
  ): Observable<any /*{ username: string; role: string }*/> {
    const url = `${environment.apiUrl}/api/auth/login`;
    console.log('log-in called');

    return this.http
      .post<any>(url, { username, password })
      .pipe(tap(data => this.userRole.next(data?.role)));
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
    return this.userRole.asObservable().pipe(map(role => !!role));
  }

  public canPlay(): Observable<boolean> {
    return this.userRole
      .asObservable()
      .pipe(map(role => role === UserRole.USER || role === UserRole.ADMIN));
  }

  public canPostData(): Observable<boolean> {
    return this.userRole
      .asObservable()
      .pipe(map(role => role === UserRole.ADMIN));
  }

  public checkCookie(): Observable<{ role: string }> {
    const url = `${environment.apiUrl}/api/auth/check-token`;

    return this.http.get<{ role: UserRole }>(url).pipe(
      tap(data => {
        console.log('cookie checked: ', data);
        this.userRole.next(data?.role);
      })
    );
  }
}
