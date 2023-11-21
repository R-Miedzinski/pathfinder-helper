import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import * as AppSelectors from './core/ngrx/selectors/app.selector';
import * as AppActions from './core/ngrx/actions/app.actions';
import { AppState } from './core/ngrx/interfaces/app-state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private ngDestroyed$: Subject<void> = new Subject<void>();
  showSideNav$?: any;
  exampleToggle$?: Observable<Boolean>;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.showSideNav$ = this.store
      .select(AppSelectors.getShowSideNav)
      .pipe(takeUntil(this.ngDestroyed$));
  }

  ngOnDestroy(): void {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }
}
