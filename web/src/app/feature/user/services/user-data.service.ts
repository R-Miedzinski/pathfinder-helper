import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Game } from 'rpg-app-shared-package/dist/public-api';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  constructor(private http: HttpClient) {}

  public getUserGames(id: string): Observable<Game[]> {
    const url = `${environment.apiUrl}/api/user/games/${id}`;

    return this.http.get<Game[]>(url);
  }
}
