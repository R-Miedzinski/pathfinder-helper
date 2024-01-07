import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { GameState } from '../ngrx/game-reducer';
import * as GameActions from '../ngrx/game-actions';
import { Subject, takeUntil, tap } from 'rxjs';
import { Character } from '../models/character';
import * as GameSelectors from '../ngrx/game-selector';
import { cloneDeep } from 'lodash';
import { ItemsService } from '../services/items.service';
import { SpellsService } from '../services/spells.service';
import { Spell } from '../models/spell';

@Component({
  selector: 'app-character-sheet',
  templateUrl: './character-sheet.component.html',
  styleUrls: ['./character-sheet.component.scss'],
})
export class CharacterSheetComponent implements OnInit, OnDestroy {
  private readonly ngDestroyed$: Subject<void> = new Subject();
  character: Character = {} as Character;
  inventoryWithItems = this.itemsService.itemsInInventory$.pipe(
    takeUntil(this.ngDestroyed$)
  );
  equippedItems = this.itemsService.equippedItems$.pipe(
    takeUntil(this.ngDestroyed$)
  );
  InvestedItems = this.itemsService.investedItems$.pipe(
    takeUntil(this.ngDestroyed$)
  );
  spellsList: Spell[] = [];
  public readonly rowHeight = 12.8;

  constructor(
    private store: Store<GameState>,
    private itemsService: ItemsService,
    private spellsService: SpellsService
  ) {}

  public ngOnInit(): void {
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
      .select(GameSelectors.getSpells)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: (spellIds: string[]) => {
          this.spellsService
            .getSpells(spellIds)
            .pipe(takeUntil(this.ngDestroyed$))
            .subscribe({
              next: spells => (this.spellsList = spells),
            });
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

  // private calculateInitiative(): void {
  //   const newInititative = this.abilityModifierPipe.transform(
  //     this.character.abilities.dex
  //   );
  //   this.store.dispatch(
  //     GameActions.saveInitiativeAction({ initiativeMod: newInititative })
  //   );
  // }

  // private calculateArmorClass(): void {
  //   const newAC =
  //     10 + this.abilityModifierPipe.transform(this.character.abilities.dex);
  //   this.store.dispatch(
  //     GameActions.saveArmorClassAction({ armorClass: newAC })
  //   );
  // }

  // private calculateSkillBonus(): void {
  //   for (let skill of this.character.skills) {
  //     let newSkillValue = this.abilityModifierPipe.transform(
  //       this.character.abilities[skill.ability]
  //     );
  //     switch (skill.level) {
  //       case Proficiency.T:
  //         newSkillValue += 2;
  //         break;
  //       case Proficiency.E:
  //         newSkillValue += 4;
  //         break;
  //       case Proficiency.M:
  //         newSkillValue += 6;
  //         break;
  //       case Proficiency.L:
  //         newSkillValue += 8;
  //         break;
  //       default:
  //         break;
  //     }
  //     if (skill.level !== Proficiency.U) {
  //       newSkillValue += this.character.level;
  //     }
  //     this.store.dispatch(
  //       GameActions.saveSkillAction({
  //         skill: {
  //           ...skill,
  //           value: newSkillValue,
  //         },
  //       })
  //     );
  //   }
  // }

  // private calculateSavingThrows(): void {
  //   const newFortitude = this.abilityModifierPipe.transform(
  //     this.character.abilities.con
  //   );
  //   const newReflex = this.abilityModifierPipe.transform(
  //     this.character.abilities.dex
  //   );
  //   const newWill = this.abilityModifierPipe.transform(
  //     this.character.abilities.wis
  //   );
  //   this.store.dispatch(
  //     GameActions.saveSavingThrowsAction({
  //       savingThrows: {
  //         fortitude: newFortitude,
  //         reflex: newReflex,
  //         will: newWill,
  //       },
  //     })
  //   );
  // }

  // private applyEquipmentStats(): void {
  //   if (this.character.equippedItems) {
  //     this.character?.equippedItems.forEach(item => {
  //       const itemToApply = <Item>(
  //         this.character.inventory.find(
  //           itemInInventory => itemInInventory.name === item.item
  //         )
  //       );
  //       if (this.isItemArmor(itemToApply)) {
  //         let newAC = this.character.armorClass + itemToApply.ACbonus;
  //         const dexMod = this.abilityModifierPipe.transform(
  //           this.character.abilities.dex
  //         );
  //         if (dexMod > itemToApply.DexcCap) {
  //           newAC -= dexMod - itemToApply.DexcCap;
  //         }
  //         this.store.dispatch(
  //           GameActions.saveArmorClassAction({ armorClass: newAC })
  //         );
  //       }
  //     });
  //   }
  // }

  // private isItemArmor(item: Item): item is Armor {
  //   return item.itemType === ItemType.armor;
  // }

  // private isItemWeapon(item: Item): item is Weapon {
  //   return item.itemType === ItemType.weapon;
  // }
}
