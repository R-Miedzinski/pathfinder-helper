import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/ngrx/interfaces/app-state';
import * as AppActions from '../../../core/ngrx/actions/app.actions';
import { GameDataService } from '../services/game-data.service';
import { Subject, takeUntil } from 'rxjs';
import * as GameActions from '../ngrx/game-actions';
import { CharacterSheetMode } from '../models/enums/character-sheet-mode';
import * as GameSelectors from '../ngrx/game-selector';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
})
export class PanelComponent implements OnInit, OnDestroy {
  protected mode: CharacterSheetMode = CharacterSheetMode.view;
  protected currentGame: string = '';
  protected modes = CharacterSheetMode;
  private readonly ngDestroyed$: Subject<void> = new Subject();

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private gameData: GameDataService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.ngDestroyed$)).subscribe(params => {
      this.currentGame = params['id'];
      this.gameData
        .getCharacter(this.currentGame)
        .pipe(takeUntil(this.ngDestroyed$))
        .subscribe({
          next: character => {
            if (character !== 'new_character') {
              this.store.dispatch(
                GameActions.saveCharacterAction({ character })
              );
            } else {
              this.router.navigate(['../new'], { relativeTo: this.route });
            }
          },
        });
    });

    this.store
      .select(GameSelectors.getMode)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe(mode => (this.mode = mode));
  }

  backToMenu(): void {
    this.router.navigate(['/user']);
  }

  goToGame(id: number) {
    this.router.navigate(['../', id], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    this.store.dispatch(AppActions.setCurrentGame({ name: null }));
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  protected toggleEditMode(): void {
    this.store.dispatch(
      GameActions.setMode({
        mode: this.mode === this.modes.edit ? this.modes.view : this.modes.edit,
      })
    );
  }
}
