import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/ngrx/interfaces/app-state';
import * as AppActions from '../../../core/ngrx/actions/app.actions';
import { GameDataService } from '../services/game-data.service';
import { Subject, takeUntil } from 'rxjs';
import * as GameActions from '../ngrx/game-actions';
import * as GameSelectors from '../ngrx/game-selector';
import {
  CharacterSheetMode,
  newCharacter,
} from 'rpg-app-shared-package/dist/public-api';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
})
export class PanelComponent implements OnInit, OnDestroy {
  protected mode: CharacterSheetMode = CharacterSheetMode.view;
  protected currentGame: string = '';
  protected modes = CharacterSheetMode;
  protected isNewCharacter: boolean = false;
  protected characterId?: string;
  private readonly ngDestroyed$: Subject<void> = new Subject();

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private gameData: GameDataService,
    private route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.ngDestroyed$)).subscribe(params => {
      this.currentGame = params['id'];
      this.gameData.gameId = this.currentGame;
      this.gameData
        .getCharacter()
        .pipe(takeUntil(this.ngDestroyed$))
        .subscribe({
          next: character => {
            if (character !== 'NEW') {
              this.characterId = character.id;
              this.store.dispatch(
                GameActions.saveCharacterAction({ character })
              );
              this.isNewCharacter = false;
            } else {
              const character = newCharacter();
              character.id = '0';
              this.characterId = character.id;
              this.store.dispatch(
                GameActions.saveCharacterAction({ character })
              );
              this.isNewCharacter = true;
            }
          },
        });
    });

    this.store
      .select(GameSelectors.getMode)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe(mode => (this.mode = mode));
  }

  public ngOnDestroy(): void {
    this.store.dispatch(AppActions.setCurrentGame({ id: '', name: '' }));
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  protected backToMenu(): void {
    this.router.navigate(['/user']);
  }

  protected goToGame(id: number) {
    this.store.dispatch(GameActions.setMode({ mode: this.modes.view }));
    this.router.navigate(['../', id], { relativeTo: this.route });
  }

  protected toggleEditMode(): void {
    this.store.dispatch(
      GameActions.setMode({
        mode: this.mode === this.modes.edit ? this.modes.view : this.modes.edit,
      })
    );
  }
}
