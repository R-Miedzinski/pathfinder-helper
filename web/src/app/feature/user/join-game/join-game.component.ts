import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Game } from 'rpg-app-shared-package/dist/public-api';
import { Subject, takeUntil } from 'rxjs';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-join-game',
  templateUrl: './join-game.component.html',
  styleUrls: ['./join-game.component.scss'],
})
export class JoinGameComponent implements OnInit, OnDestroy {
  protected selectedGame: number = -1;
  protected nameControl: FormControl = new FormControl('');
  protected elseMessage = '';

  protected games: Game[] = [];

  private readonly ngDestroyed$: Subject<void> = new Subject();
  private readonly DEFFAULT_ELSE_MESSAGE =
    'Start typing name to show available results';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  public ngOnInit(): void {
    this.elseMessage = this.DEFFAULT_ELSE_MESSAGE;

    this.nameControl.valueChanges.pipe(takeUntil(this.ngDestroyed$)).subscribe({
      next: name => {
        if (name.length >= 3) {
          this.fetchGames(name);
        } else {
          this.elseMessage =
            name.length === 0
              ? this.DEFFAULT_ELSE_MESSAGE
              : 'Enter at least 3 characters';
          this.games = [];
        }
      },
    });
  }

  public ngOnDestroy(): void {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  protected navigateTo(path: string): void {
    this.router.navigate([path], { relativeTo: this.route });
  }

  protected selectGame(id: number): void {
    if (id === this.selectedGame) {
      this.selectedGame = -1;
    } else {
      this.selectedGame = id;
    }
  }

  protected joinGame(): void {
    if (this.selectedGame >= 0) {
      const url = `${environment.apiUrl}/api/games/join`;
      const id = this.games[this.selectedGame]._id;

      this.http.get(url, { params: { id } }).subscribe({
        next: data => {
          this.navigateTo(`../game/${id}`);
        },
      });
    }
  }

  private fetchGames(name: string): void {
    const url = `${environment.apiUrl}/api/games/search`;

    this.http
      .post<Game[]>(url, { name })
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: games => (this.games = games),
        error: err => (this.elseMessage = 'No games found'),
      });
  }
}
