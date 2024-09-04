import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserRole } from 'rpg-app-shared-package/dist/public-api';
import { Observable, tap, map, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userRole: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(private http: HttpClient) {}

  public logOut(): Observable<{ message: string; success: boolean }> {
    const url = `${environment.apiUrl}/api/auth/logout`;

    return this.http
      .get<{ message: string; success: boolean }>(url)
      .pipe(tap(data => this.userRole.next('')));
  }

  public login(
    username: string,
    password: string
  ): Observable<any /*{ username: string; role: string }*/> {
    const url = `${environment.apiUrl}/api/auth/login`;

    const body = { username, password };
    const headers = new HttpHeaders().set('content-type', 'application/json');

    return this.http
      .post<any>(url, body, { headers })
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

  public isUserCodeUnique(userCode: string): Observable<boolean> {
    const url = `${environment.apiUrl}/api/auth/check-unique-code`;

    return this.http
      .get<{ isUnique: boolean }>(url, { params: { user_code: userCode } })
      .pipe(map(response => response.isUnique));
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
