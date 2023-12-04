import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/ngrx/interfaces/app-state';
import * as AppActions from '../../../core/ngrx/actions/app.actions';
import { GameDataService } from '../services/game-data.service';
import { Subject, takeUntil } from 'rxjs';
import * as GameActions from '../ngrx/game-actions';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
})
export class PanelComponent implements OnInit, OnDestroy {
  private readonly ngDestroyed$: Subject<void> = new Subject();

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private gameData: GameDataService
  ) {}

  ngOnInit(): void {
    this.gameData
      .getCharacter('0')
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: character => {
          this.store.dispatch(GameActions.saveCharacterAction({ character }));
        },
      });
  }

  backToMenu(): void {
    this.router.navigate(['/user']);
  }

  ngOnDestroy(): void {
    this.store.dispatch(AppActions.setCurrentGame({ name: null }));
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }
}
