import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/ngrx/interfaces/app-state';
import * as AppActions from '../../../core/ngrx/actions/app.actions';
import { GameDataService } from '../services/game-data.service';
import { combineLatest, Subject, takeUntil } from 'rxjs';
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
  protected currentGame: string = '';
  protected isNewCharacter: boolean = false;
  protected isCharacterLoaded: boolean = false;
  private readonly ngDestroyed$: Subject<void> = new Subject();

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private gameData: GameDataService,
    private route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    combineLatest([this.route.params, this.route.queryParams])
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe(([params, queryParams]) => {
        this.currentGame = params['id'];
        const contains = queryParams['hasCharacter'];

        this.gameData.gameId = this.currentGame;
        this.gameData
          .getCharacter(contains)
          .pipe(takeUntil(this.ngDestroyed$))
          .subscribe({
            next: character => {
              if (typeof character !== 'string') {
                this.isCharacterLoaded = true;
                this.store.dispatch(
                  GameActions.saveCharacterAction({ character })
                );
                this.isNewCharacter = false;
              } else {
                const character = newCharacter();
                this.isCharacterLoaded = true;
                this.store.dispatch(
                  GameActions.saveCharacterAction({ character })
                );
                this.isNewCharacter = true;
              }
            },
          });
      });
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
    this.store.dispatch(GameActions.setMode({ mode: CharacterSheetMode.view }));
    this.router.navigate(['../', id], { relativeTo: this.route });
  }
}
