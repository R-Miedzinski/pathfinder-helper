import { Injectable } from '@angular/core';
import { Item } from '../models/item';
import { GameState } from '../ngrx/game-reducer';
import { Store } from '@ngrx/store';
import { Character } from '../models/character';
import * as GameSelectors from '../ngrx/game-selector';

@Injectable()
export class EquipmentService {
  character!: Character;

  constructor(private store: Store<GameState>) {
    this.store.select(GameSelectors.getCharacter).subscribe({
      next: (character: Character) => {
        this.character = character;
      },
    });
  }

  public equip(item: Item): void {}

  public deEquip(item: Item): void {}

  public invest(item: Item): void {}

  public deInvest(item: Item): void {}

  private applyStats(): void {}
}
