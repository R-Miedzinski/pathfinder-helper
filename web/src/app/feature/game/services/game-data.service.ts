import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BackgroundData,
  Character,
  Classes,
  DisplayInitClassData,
  DisplayLevelUpClassData,
  LevelBonus,
  Race,
  RaceData,
  SeedCharacterData,
} from 'rpg-app-shared-package/dist/public-api';
import { EMPTY, Observable, catchError, of, map, mergeMap } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HttpCacheClientService } from 'src/app/shared/services/http-cache-client.service';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class GameDataService {
  private _gameId: string = '';

  constructor(
    private httpClient: HttpClient,
    private httpCacheClient: HttpCacheClientService,
    private authClient: AuthService
  ) {}

  public set gameId(id: string) {
    this._gameId = id;
  }

  public get gameId(): string | undefined {
    return this._gameId;
  }

  public getCharacter(contains?: string): Observable<Character | string> {
    return this.authClient.isLoggedIn().pipe(
      mergeMap(isLoggedIn => {
        if (this._gameId !== '-1' && isLoggedIn && contains !== 'N') {
          const url = `${environment.apiUrl}/api/character?gameId=${this._gameId}`;
          const headers = new HttpHeaders();
          return this.httpClient
            .get<Character>(url)
            .pipe(catchError(err => 'NEW'));
        } else {
          return of('NEW');
        }
      })
    );
  }

  public getSeedData(): Observable<SeedCharacterData> {
    const url = `${environment.apiUrl}/api/character/seed-character-data?gameId=${this._gameId}`;

    return this.httpClient.get<SeedCharacterData>(url);
  }

  public getRaceBonuses(race: Race): Observable<RaceData> {
    const url = `${environment.apiUrl}/api/race/${race}`;

    return this.httpCacheClient.get<RaceData>(url);
  }

  public getBackgrounds(): Observable<{ id: string; name: string }[]> {
    const url = `${environment.apiUrl}/api/backgrounds`;

    return this.httpClient.get<{ id: string; name: string }[]>(url).pipe(
      catchError((err: HttpErrorResponse) => {
        console.error('error in getting backgrounds', err.message);
        return of([]);
      })
    );
  }

  public getBackgorundData(id: string): Observable<BackgroundData> {
    const url = `${environment.apiUrl}/api/backgrounds/${id}`;

    return this.httpCacheClient.get<BackgroundData>(url);
  }

  public getClasses(): Observable<{ id: string; name: Classes }[]> {
    const url = `${environment.apiUrl}/api/classes`;

    return this.httpClient.get<{ id: string; name: Classes }[]>(url).pipe(
      catchError((err: HttpErrorResponse) => {
        console.error('error in getting classes', err.message);
        return EMPTY;
      })
    );
  }

  public getClassData(id: string): Observable<DisplayInitClassData> {
    const url = `${environment.apiUrl}/api/classes/init/${id}`;

    return this.httpCacheClient.get<DisplayInitClassData>(url);
  }

  public getClassLevelData(
    id: string,
    level: number
  ): Observable<LevelBonus[]> {
    const url = `${environment.apiUrl}/api/classes/level/${id}`;

    return this.httpCacheClient.get<DisplayLevelUpClassData>(url).pipe(
      map(data => {
        const levelBonus = data[level];
        return levelBonus ?? [];
      })
    );
  }

  public previewNewCharacter(
    characterData: SeedCharacterData
  ): Observable<Character> {
    const url = `${environment.apiUrl}/api/character/new-character-preview`;

    return this.httpCacheClient.post<Character>(url, characterData);
  }

  public saveNewCharacter(
    characterData: SeedCharacterData
  ): Observable<Character> {
    const url = `${environment.apiUrl}/api/character/save-new-character`;

    return this.httpCacheClient.post<Character>(url, {
      data: characterData,
      gameId: this._gameId,
    });
  }

  public patchCharacterData(
    characterData: SeedCharacterData
  ): Observable<HttpResponse<string>> {
    const url = `${environment.apiUrl}/api/character/update`;

    return this.httpClient.put<HttpResponse<string>>(url, {
      characterData,
      gameId: this._gameId,
    });
  }
}
