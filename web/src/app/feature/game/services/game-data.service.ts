import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BackgroundData,
  Character,
  DisplayInitClassData,
  Race,
  RaceData,
  SeedCharacterData,
} from 'rpg-app-shared-package/dist/public-api';
import { Observable, catchError, of } from 'rxjs';
import { HttpCacheClientService } from 'src/app/shared/services/http-cache-client.service';
import { environment } from 'src/environment/environment';

@Injectable()
export class GameDataService {
  constructor(
    private httpClient: HttpClient,
    private httpCacheClient: HttpCacheClientService
  ) {}

  public getCharacter(
    gameId: string,
    userId: string
  ): Observable<Character | 'NEW'> {
    if (Number(gameId) > 0) {
      // return of(characterMock);
      const url = `${environment.apiUrl}/api/character?gameId=${gameId}&userId=${userId}`;
      const headers = new HttpHeaders();
      return this.httpClient.get<Character>(url);
    } else {
      return of('NEW');
    }
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

  public getClasses(): Observable<{ id: string; name: string }[]> {
    const url = `${environment.apiUrl}/api/classes`;

    return this.httpClient.get<{ id: string; name: string }[]>(url).pipe(
      catchError((err: HttpErrorResponse) => {
        console.error('error in getting classes', err.message);
        return of([]);
      })
    );
  }

  public getClassData(id: string): Observable<DisplayInitClassData> {
    const url = `${environment.apiUrl}/api/classes/init/${id}`;

    return this.httpCacheClient.get<DisplayInitClassData>(url);
  }

  public previewNewCharacter(
    characterData: SeedCharacterData
  ): Observable<Character> {
    const url = `${environment.apiUrl}/api/character/new-character-preview`;

    return this.httpCacheClient.post<Character>(url, characterData);
  }

  public saveNewCharacter(
    characterData: SeedCharacterData,
    userId: string,
    gameId: string
  ): Observable<Character> {
    const url = `${environment.apiUrl}/api/character/save-new-character`;

    return this.httpCacheClient.post<Character>(url, {
      data: characterData,
      userId,
      gameId,
    });
  }
}
