import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { GameState } from '../ngrx/game-reducer';
import * as GameActions from '../ngrx/game-actions';
import { Observable, Subject, takeUntil } from 'rxjs';
import * as GameSelectors from '../ngrx/game-selector';
import { cloneDeep } from 'lodash';
import { ItemsService } from '../services/items.service';
import { SpellsService } from '../services/spells.service';
import { FeatsService } from '../services/feats.service';
import { ActionService } from '../services/action.service';
import { SkillsService } from '../services/skills.service';
import { AbilitiesService } from '../services/abilities.service';
import { Character, CharacterSheetMode, Feat } from 'rpg-app-shared-package';

@Component({
  selector: 'app-character-sheet',
  templateUrl: './character-sheet.component.html',
  styleUrls: ['./character-sheet.component.scss'],
})
export class CharacterSheetComponent implements OnInit, OnDestroy {
  public readonly rowHeight = 19.6;
  protected mode: CharacterSheetMode = CharacterSheetMode.view;
  protected character!: Character;
  private readonly ngDestroyed$: Subject<void> = new Subject();

  protected inventoryWithItems = this.itemsService.itemsInInventory$.pipe(
    takeUntil(this.ngDestroyed$)
  );
  protected equippedItems = this.itemsService.equippedItems$.pipe(
    takeUntil(this.ngDestroyed$)
  );
  protected investedItems = this.itemsService.investedItems$.pipe(
    takeUntil(this.ngDestroyed$)
  );
  protected spellsList = this.spellsService.spellList$.pipe(
    takeUntil(this.ngDestroyed$)
  );
  protected featsList: Observable<Feat[]> = new Observable();
  protected actionsList = this.actionService.actionsList$.pipe(
    takeUntil(this.ngDestroyed$)
  );

  constructor(
    private store: Store<GameState>,
    private itemsService: ItemsService,
    private spellsService: SpellsService,
    private featsService: FeatsService,
    private actionService: ActionService,
    private skillsService: SkillsService,
    private abilitiesService: AbilitiesService
  ) {}

  public ngOnInit(): void {
    this.store
      .select(GameSelectors.getMode)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: (mode: CharacterSheetMode) => (this.mode = mode),
      });

    this.store
      .select(GameSelectors.getCharacter)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: (character: Character) => {
          this.character = character;
        },
      });

    this.store
      .select(GameSelectors.getInventory)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: (inventory: { itemId: string; count: number }[]) => {
          this.itemsService.getItems(inventory);
        },
      });

    this.store
      .select(GameSelectors.getFeats)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: (featIds: { id: string; name: string }[]) => {
          this.featsList = this.featsService.getFeats(
            featIds.map(item => item.id)
          );
        },
      });

    this.store
      .select(GameSelectors.getSpells)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: (spellIds: string[]) => {
          this.spellsService.getSpells(spellIds);
        },
      });

    this.store
      .select(GameSelectors.getActions)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: (actionIds: string[]) => {
          this.actionService.getActions(actionIds);
        },
      });
    // this.skillsService.recalculateSkills();
    // this.abilitiesService.recalculateAbilities();
  }

  public ngOnDestroy(): void {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  public handleHealthChange(hpChange: {
    change: number;
    addTemp: boolean;
  }): void {
    const newHP = cloneDeep(this.character.hp);

    if (hpChange.addTemp && hpChange.change >= 0) {
      newHP.temporary = hpChange.change;
    } else if (!hpChange.addTemp) {
      let changeAmount = hpChange.change;
      if (changeAmount >= 0) {
        changeAmount + newHP.current <= newHP.maximum
          ? (newHP.current += changeAmount)
          : (newHP.current = newHP.maximum);
      } else {
        changeAmount = -changeAmount;
        newHP.temporary - changeAmount >= 0
          ? (newHP.temporary -= changeAmount)
          : (newHP.current - (changeAmount - newHP.temporary) >= 0
              ? (newHP.current -= changeAmount - newHP.temporary)
              : (newHP.current = 0),
            (newHP.temporary = 0));
      }
    }
    this.store.dispatch(GameActions.saveHealthAction({ hp: newHP }));
  }

  public changeEquipment(event: { action: string; itemId: string }): void {
    console.log('event from equipment: ', event.action, event.itemId);
    if (event.action === 'equip') {
      this.itemsService.equipItem({ itemId: event.itemId, count: 1 });
    }
    if (event.action === 'deequip') {
      this.itemsService.deequipItem(event.itemId);
    }
    if (event.action === 'invest') {
      this.itemsService.investItem({ itemId: event.itemId, count: 1 });
    }
    if (event.action === 'deinvest') {
      this.itemsService.deinvestItem(event.itemId);
    }
  }
}
