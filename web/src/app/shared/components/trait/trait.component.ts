import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { HttpCacheClientService } from '../../services/http-cache-client.service';
import { Observable, Subject, takeUntil, map, catchError, of } from 'rxjs';
import { environment } from 'src/environment/environment';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-trait',
  templateUrl: './trait.component.html',
  styleUrls: ['./trait.component.scss'],
})
export class TraitComponent implements OnInit, OnDestroy {
  @Input() traitId: string = '';
  @Input() position?:
    | 'left'
    | 'right'
    | 'top'
    | 'bottom'
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right';
  protected traitDesc: string = 'No trait description found';
  private readonly ngDestroyed$: Subject<void> = new Subject();

  constructor(private httpCacheClient: HttpCacheClientService) {}

  public ngOnInit(): void {
    this.getDescription(this.traitId)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: (descritption: string) => {
          this.traitDesc = descritption;
        },
      });
  }

  public ngOnDestroy(): void {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  private getDescription(traitId: string): Observable<string> {
    const url = `${environment.apiUrl}/api/traits/${traitId}`;

    return this.httpCacheClient
      .get<{ id: string; description: string }>(url)
      .pipe(
        map(item => item.description),
        catchError(this.handleError)
      );
  }

  private handleError(): Observable<string> {
    return of('No trait description found');
  }
}
