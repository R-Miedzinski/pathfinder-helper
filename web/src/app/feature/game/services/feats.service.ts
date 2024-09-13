import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, combineLatest } from 'rxjs';
import {
  Classes,
  Feat,
  FeatCategory,
  Race,
} from 'rpg-app-shared-package/dist/public-api';
import { HttpCacheClientService } from 'src/app/shared/services/http-cache-client.service';
import { environment } from 'src/environment/environment';

@Injectable()
export class FeatsService implements OnDestroy {
  private readonly ngOnDestroy$ = new Subject<void>();

  constructor(private http: HttpCacheClientService) {}

  public ngOnDestroy(): void {
    this.ngOnDestroy$.next();
    this.ngOnDestroy$.complete();
  }

  public getFeats(featIds: string[]): Observable<Feat[]> {
    const featCalls: Observable<Feat>[] = featIds.map(id => {
      const featUrl = environment.apiUrl + '/api/feats/' + id;

      return this.http.get<Feat>(featUrl);
    });

    return combineLatest(featCalls);
  }

  public getRaceFeatsToAdd(level: number, race: Race): Observable<Feat[]> {
    const url = `${environment.apiUrl}/api/feats/race-feats?race=${race}&level=${level}`;

    return this.http.get<Feat[]>(url);
  }

  public getHeritageFeats(race: Race): Observable<Feat[]> {
    const url = `${environment.apiUrl}/api/feats/heritage-feats?race=${race}`;

    return this.http.get<Feat[]>(url);
  }

  public getClassFeatsToAdd(
    level: number,
    charClass: Classes
  ): Observable<Feat[]> {
    const url = `${environment.apiUrl}/api/feats/class-feats?class=${charClass}&level=${level}`;

    return this.http.get<Feat[]>(url);
  }

  public getFeatsQuery(
    level: number,
    category: FeatCategory,
    trait?: string
  ): Observable<Feat[]> {
    const url = `${
      environment.apiUrl
    }/api/feats/query?category=${category}&level=${level}${
      trait ? `&trait=${trait}` : ''
    }`;

    return this.http.get<Feat[]>(url);
  }
}
