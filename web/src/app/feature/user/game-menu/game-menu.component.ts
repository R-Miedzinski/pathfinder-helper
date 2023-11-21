import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Game } from 'src/app/core/model/game';
import { AppState } from 'src/app/core/ngrx/interfaces/app-state';
import * as AppActions from '../../../core/ngrx/actions/app.actions';

@Component({
  selector: 'app-game-menu',
  templateUrl: './game-menu.component.html',
  styleUrls: ['./game-menu.component.scss'],
})
export class GameMenuComponent implements OnInit {
  games: Game[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.games = [
      {
        id: '1',
        name: 'some first game',
      },
      {
        id: '2',
        name: 'some other game',
      },
      {
        id: '3',
        name: 'one another game',
      },
      {
        id: '-1',
        name: 'New Game',
        description: 'Create new game',
      },
    ];
  }

  joinGame(id: string, name: string): void {
    console.error('join game not implemented yet');
    if (Number(id) >= 0) {
      this.store.dispatch(AppActions.setCurrentGame({ name }));
      this.router.navigate(['./game/', id], { relativeTo: this.route });
    } else {
      this.router.navigate(['./newgame'], { relativeTo: this.route });
    }
  }
}
