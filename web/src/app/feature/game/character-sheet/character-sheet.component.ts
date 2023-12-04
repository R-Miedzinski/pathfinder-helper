import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { GameState } from '../ngrx/game-reducer';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Character } from '../models/character';
import * as GameSelectors from '../ngrx/game-selector';

@Component({
  selector: 'app-character-sheet',
  templateUrl: './character-sheet.component.html',
  styleUrls: ['./character-sheet.component.scss'],
})
export class CharacterSheetComponent implements OnInit, OnDestroy {
  private readonly ngDestroyed$: Subject<void> = new Subject();
  character: Character = {} as Character;

  constructor(private store: Store<GameState>) {}

  ngOnInit(): void {
    this.store
      .select(GameSelectors.getCharacter)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: (character: Character) => {
          this.character = character;
        },
      });
  }

  ngOnDestroy(): void {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }
}
