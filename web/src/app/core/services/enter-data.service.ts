import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { DataCategory, DataCategoryUrl } from '../model/data-entry-category';
import { HttpCacheClientService } from 'src/app/shared/services/http-cache-client.service';

@Injectable({
  providedIn: 'root',
})
export class EnterDataService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpCacheClientService) {}

  public create<T>(entry: T, category: DataCategory): Observable<string> {
    const url = this.baseUrl + DataCategoryUrl[category];

    return this.http.post<string>(url, entry);
  }

  //  TODO: put call on resources, might be needed
  // public update<T>(id: string, entry: T): Observable<T> {

  // }

  // TODO: determine if needed here
  // public abstract read<T>(id: string): Observable<T> {

  // }

  // public delete(id: string): string {

  // }
}
