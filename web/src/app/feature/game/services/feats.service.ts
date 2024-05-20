import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  combineLatest,
  of,
  takeUntil,
} from 'rxjs';
import { cloneDeep } from 'lodash';
import { GameState } from '../ngrx/game-reducer';
import * as GameActions from '../ngrx/game-actions';
import { Store } from '@ngrx/store';
import { Classes, Feat, Race } from 'rpg-app-shared-package/dist/public-api';
import { HttpCacheClientService } from 'src/app/shared/services/http-cache-client.service';
import { environment } from 'src/environment/environment';

@Injectable()
export class FeatsService implements OnDestroy {
  public featList$: BehaviorSubject<Feat[]> = new BehaviorSubject<Feat[]>([]);
  private feats: Feat[] = [];
  private readonly ngOnDestroy$ = new Subject<void>();

  constructor(private http: HttpCacheClientService) {
    this.featList$.pipe(takeUntil(this.ngOnDestroy$)).subscribe({
      next: list => (this.feats = cloneDeep(list)),
    });
  }

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

  public getClassFeatsToAdd(
    level: number,
    charClass: Classes
  ): Observable<Feat[]> {
    const url = `${environment.apiUrl}/api/feats/class-feats?class=${charClass}&level=${level}`;

    return this.http.get<Feat[]>(url);
  }
}
