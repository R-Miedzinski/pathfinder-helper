import { Injectable } from '@angular/core';
import {
  CharacterAction,
  CharacterActionType,
  Feat,
} from 'rpg-app-shared-package/dist/public-api';
import { Observable, map } from 'rxjs';
import { Action } from 'rxjs/internal/scheduler/Action';
import { HttpCacheClientService } from 'src/app/shared/services/http-cache-client.service';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AddEffectService {
  constructor(private http: HttpCacheClientService) {}

  public getFeatIds(): Observable<{ id: string; name: string }[]> {
    const url = environment.apiUrl + '/api/feats';

    return this.http
      .get<Feat[]>(url)
      .pipe(
        map(feats => feats.map(feat => ({ id: feat.id, name: feat.name })))
      );
  }

  public getActionIds(): Observable<{ id: string; name: string }[]> {
    const url = environment.apiUrl + '/api/actions';

    return this.http
      .get<CharacterAction[]>(url)
      .pipe(
        map(actions =>
          actions
            .filter(action => action.type !== CharacterActionType.base)
            .map(action => ({ id: action.id, name: action.name }))
        )
      );
  }
}
