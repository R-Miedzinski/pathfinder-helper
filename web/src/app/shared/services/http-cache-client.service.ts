import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, catchError, of, tap } from 'rxjs';

const enum httpTypes {
  get = 'GET',
  post = 'POST',
  put = 'PUT',
  delete = 'DELETE',
}

@Injectable()
export class HttpCacheClientService {
  private requestCache: Map<string, any> = new Map();

  constructor(private http: HttpClient) {}

  public get<T>(url: string): Observable<T> {
    const data = this.requestCache.get(url + httpTypes.get);
    if (data) {
      // console.log(`retrieving data from cache: ${url}`);
      return of(data);
    }

    return this.http.get<T>(url).pipe(
      catchError((err: HttpErrorResponse) => {
        console.error(
          `Error in getting request data from: ${url}`,
          err.message
        );
        return EMPTY;
      }),
      tap((data: T) => {
        console.log(`putting into cache: ${url}`);
        this.requestCache.set(url + httpTypes.get, data);
      })
    );
  }

  public post<T>(url: string, payload: any): Observable<T> {
    return this.http.post<T>(url, payload).pipe(
      tap(response => {
        console.log('clearing cash for urls starting from: ', url);
        this.clearCache(url);
      })
    );
  }

  public clearCache(param?: string): void {
    if (param) {
      for (const key of this.requestCache.keys()) {
        if (key.includes(param)) {
          this.requestCache.delete(key);
        }
      }
    } else {
      this.requestCache.clear();
    }
  }
}
