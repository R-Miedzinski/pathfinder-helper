import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppState } from '../ngrx/interfaces/app-state';
import { Store } from '@ngrx/store';
import * as AppActions from '../ngrx/actions/app.actions';
import * as AppSelectors from '../ngrx/selectors/app.selector';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit, OnDestroy {
  ngDestroyed$: Subject<void> = new Subject<void>();
  gameName$?: Observable<string | undefined>;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.gameName$ = this.store
      .select(AppSelectors.getCurrentGame)
      .pipe(takeUntil(this.ngDestroyed$));
  }

  toggleSideNav(): void {
    this.store.dispatch(AppActions.toggleSideNav());
  }

  ngOnDestroy(): void {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }
}
