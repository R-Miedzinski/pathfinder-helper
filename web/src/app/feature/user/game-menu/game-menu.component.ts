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
      _id: '-1',
      name: 'New game',
      users: [],
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
    if (id != '-1') {
      this.userDataService
        .hasCharacterInGame(
          this.games
            .find(game => game._id === id)
            ?.characters.map(data => data.id) ?? []
        )
        .subscribe({
          next: contains => {
            this.store.dispatch(AppActions.setCurrentGame({ id, name }));
            this.router.navigate(['./game/', id], {
              queryParams: { hasCharacter: contains ? 'T' : 'N' },
              relativeTo: this.route,
            });
          },
        });
    } else {
      this.router.navigate(['./new-game'], { relativeTo: this.route });
    }
  }
}
