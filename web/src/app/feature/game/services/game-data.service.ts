import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { environment } from 'src/environment/environment';
import { Character } from '../../../shared/models/interfaces/character';
import { Race } from '../../../shared/models/enums/race';
import { RaceData } from '../../../shared/models/interfaces/race-data';
import { Abilities } from '../../../shared/models/enums/abilities';

@Injectable()
export class GameDataService {
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
    // const MOCK_RACE_DATA: RaceData = {
    //   name: race,
    //   description: 'Sample race description. This is a really nice race',
    //   boosts: [],
    //   flaws: [Abilities.int],
    // };
    const url = `${environment.apiUrl}/api/race/${race}`;

    return this.httpClient.get<RaceData>(url).pipe(
      catchError((err: HttpErrorResponse) => {
        console.error('Error in getting race', err.message);
        return of({
          name: Race.human,
          description: '',
          boosts: [],
          flaws: [],
        } as RaceData);
      })
    );
  }
}
