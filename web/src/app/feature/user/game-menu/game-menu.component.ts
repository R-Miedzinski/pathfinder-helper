import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/ngrx/interfaces/app-state';
import * as AppActions from '../../../core/ngrx/actions/app.actions';
import { Subject, takeUntil } from 'rxjs';
import { UserDataService } from '../services/user-data.service';
import { Game } from 'rpg-app-shared-package/dist/public-api';

@Component({
  selector: 'app-game-menu',
  templateUrl: './game-menu.component.html',
  styleUrls: ['./game-menu.component.scss'],
})
export class GameMenuComponent implements OnInit, OnDestroy {
  protected games: Game[] = [];

  private readonly newGame: Game[] = [
    {
      id: '0',
      name: 'Create a new game',
      characters: [],
      gameMaster: '',
    },
  ];
  private readonly ngDestroyed$: Subject<void> = new Subject();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private userDataService: UserDataService
  ) {}

  public ngOnInit() {
    this.userDataService
      .getUserGames()
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: games => {
          this.games = this.newGame.concat(games);
        },
      });
  }

  public ngOnDestroy(): void {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  protected joinGame(id: string, name: string): void {
    console.error('join game not implemented yet');
    if (Number(id) >= 0) {
      this.userDataService
        .hasCharacterInGame(
          this.games.find(game => game.id === id)?.characters ?? []
        )
        .subscribe({
          next: contains => {
            this.store.dispatch(AppActions.setCurrentGame({ name }));
            if (contains) {
              this.router.navigate(['./game/', id], { relativeTo: this.route });
            } else {
              this.router.navigate(['./game/new'], { relativeTo: this.route });
            }
          },
        });
    } else {
      this.router.navigate(['./newgame'], { relativeTo: this.route });
    }
  }
}
