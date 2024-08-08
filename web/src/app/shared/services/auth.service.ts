import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userRole = null;

  constructor(private http: HttpClient) {}

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

  public isLoggedIn(): boolean {
    return !!this.userRole;
  }

  public canPlay(): boolean {
    return this.userRole === 'USER' || this.userRole === 'ADMIN';
  }

  public canPostData(): boolean {
    return this.userRole === 'ADMIN';
  }
}
