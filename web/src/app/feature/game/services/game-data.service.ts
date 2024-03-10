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
import { environment } from 'src/environment/environment';

@Injectable()
export class GameDataService {
  private raceDataCache: Map<Race, RaceData> = new Map();
  private backgroundDataCache: Map<string, BackgroundData> = new Map();
  private classDataCache: Map<string, ClassData> = new Map();

  constructor(private httpClient: HttpClient) {}

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
    const raceData = this.raceDataCache.get(race);
    if (raceData) {
      return of(raceData);
    }
    const url = `${environment.apiUrl}/api/race/${race}`;

    return this.httpClient.get<RaceData>(url).pipe(
      catchError((err: HttpErrorResponse) => {
        console.error('Error in getting race', err.message);
        return EMPTY;
      }),
      tap(data => {
        if (data?.description) {
          this.raceDataCache.set(race, data);
        }
      })
    );
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
    const backgroundData = this.backgroundDataCache.get(id);
    if (backgroundData) {
      console.log('retrieving backgroundData from cahche');
      return of(backgroundData);
    }
    const url = `${environment.apiUrl}/api/backgrounds/${id}`;

    return this.httpClient.get<BackgroundData>(url).pipe(
      catchError((err: HttpErrorResponse) => {
        console.error(
          `Error in getting background data for ${id}`,
          err.message
        );
        return EMPTY;
      }),
      tap((data: BackgroundData) => {
        if (data.name) {
          console.log('putting backgroundData into cache');
          this.backgroundDataCache.set(id, data);
        }
      })
    );
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
    const classData = this.classDataCache.get(id);
    if (classData) {
      console.log('retrieving classData from cahche');
      return of(classData);
    }
    const url = `${environment.apiUrl}/api/classes/${id}`;

    return this.httpClient.get<ClassData>(url).pipe(
      catchError((err: HttpErrorResponse) => {
        console.error(
          `Error in getting background data for ${id}`,
          err.message
        );
        return EMPTY;
      }),
      tap((data: ClassData) => {
        if (data.name) {
          console.log('putting backgroundData into cache');
          this.classDataCache.set(id, data);
        }
      })
    );
  }
}
