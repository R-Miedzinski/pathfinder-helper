import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { GameState } from '../ngrx/game-reducer';
import * as GameActions from '../ngrx/game-actions';
import { Subject, takeUntil } from 'rxjs';
import { Character } from '../models/character';
import * as GameSelectors from '../ngrx/game-selector';
import { cloneDeep } from 'lodash';

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

  public handleHealthChange(value: number): void {
    const newHP = cloneDeep(this.character.hp);

    if (value > 0) {
      this.store.dispatch(
        GameActions.saveHealthAction({
          hp:
            newHP.current + value <= newHP.maximum
              ? { ...newHP, current: newHP.current + value }
              : { ...newHP, current: newHP.maximum },
        })
      );
    } else {
      newHP.temporary > -value
        ? (newHP.temporary -= -value)
        : ((newHP.current -= -value - newHP.temporary), (newHP.temporary = 0));
      newHP.current = newHP.current <= 0 ? 0 : newHP.current;
      this.store.dispatch(
        GameActions.saveHealthAction({
          hp: newHP,
        })
      );
    }
  }
}
