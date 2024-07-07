import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CharacterAction,
  CharacterActionType,
} from 'rpg-app-shared-package/dist/public-api';
import { HttpCacheClientService } from 'src/app/shared/services/http-cache-client.service';
import { environment } from 'src/environment/environment';

@Injectable()
export class ActionService {
  constructor(private http: HttpCacheClientService) {}

  public getActions(actionIds: string[]): Observable<CharacterAction[]> {
    const url = `${environment.apiUrl}/api/actions/list/${actionIds.join('.')}`;

    return this.http.get<CharacterAction[]>(url);
  }
}
