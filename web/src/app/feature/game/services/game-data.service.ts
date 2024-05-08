import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BackgroundData,
  Character,
  ClassData,
  CreatureSize,
  Race,
  RaceData,
} from 'rpg-app-shared-package/dist/public-api';
import { EMPTY, Observable, catchError, of, tap } from 'rxjs';
import { HttpCacheClientService } from 'src/app/shared/services/http-cache-client.service';
import { environment } from 'src/environment/environment';

@Injectable()
export class GameDataService {
  private raceDataCache: Map<Race, RaceData> = new Map();
  private backgroundDataCache: Map<string, BackgroundData> = new Map();
  private classDataCache: Map<string, ClassData> = new Map();

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

  public getClassData(id: string): Observable<ClassData> {
    const url = `${environment.apiUrl}/api/classes/${id}`;

    return this.httpCacheClient.get<ClassData>(url);
  }
}
