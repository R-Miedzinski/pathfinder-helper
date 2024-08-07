import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Game } from 'rpg-app-shared-package/dist/public-api';
import { map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  constructor(private http: HttpClient) {}

  public getUserGames(): Observable<Game[]> {
    const url = `${environment.apiUrl}/api/games`;

    return this.http.get<Game[]>(url);
  }

  public hasCharacterInGame(characters: string[]): Observable<boolean> {
    const url = `${environment.apiUrl}/api/user/characters`;

    return this.http.get<string[]>(url).pipe(
      tap(data => console.log(data)),
      map(data => data.some(item => characters.includes(item)))
    );
  }
}
