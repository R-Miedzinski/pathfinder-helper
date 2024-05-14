import { Injectable, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GameState } from '../ngrx/game-reducer';
import * as GameActions from '../ngrx/game-actions';
import * as GameSelectors from '../ngrx/game-selector';
import { Store } from '@ngrx/store';
import { cloneDeep } from 'lodash';
import {
  Abilities,
  Character,
  Proficiency,
  SavingThrow,
  Skill,
  createProfToValMap,
} from 'rpg-app-shared-package/dist/public-api';

@Injectable()
export class SkillsService implements OnDestroy {
  private character!: Character;
  private profToValMap: Map<Proficiency, number> = new Map();
  private readonly ngOnDestroy$ = new Subject<void>();

  constructor(private store: Store<GameState>) {
    this.store
      .select(GameSelectors.getCharacter)
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe({
        next: (data: Character) => {
          this.character = data;
          this.profToValMap = createProfToValMap(this.character.level);
        },
      });
  }

  public ngOnDestroy(): void {
    this.ngOnDestroy$.next();
    this.ngOnDestroy$.complete();
  }

  public recalculateSkills(): void {
    this.character.skills.forEach(skill => this.skillChangeHandler(skill));
    this.character.savingThrows.forEach(savingThrow =>
      this.savingThrowChangeHandler(savingThrow)
    );
    this.calculateInitiative();
  }

  public skillChangeHandler(skill: Skill): void {
    const skillToUpdate = cloneDeep(skill);
    let newValue =
      this.character.abilities.find(ability => ability.name === skill.ability)
        ?.modifier ?? 0;
    newValue += <number>this.profToValMap.get(skill.level);

    skillToUpdate.value = newValue;

    this.store.dispatch(GameActions.saveSkillAction({ skill: skillToUpdate }));
  }

  public savingThrowChangeHandler(savingThrow: SavingThrow): void {
    const savingThrowToUpdate = cloneDeep(savingThrow);
    let newValue =
      this.character.abilities.find(
        ability => ability.name === savingThrow.ability
      )?.modifier ?? 0;
    newValue += <number>this.profToValMap.get(savingThrow.proficiency);

    savingThrowToUpdate.value = newValue;

    this.store.dispatch(
      GameActions.saveSavingThrowAction({ savingThrow: savingThrowToUpdate })
    );
  }

  public calculateInitiative(): void {
    const dexMod = <number>(
      this.character.abilities.find(ability => ability.name === Abilities.dex)
        ?.modifier
    );

    this.store.dispatch(
      GameActions.saveInitiativeAction({
        initiativeMod: dexMod >= 0 ? dexMod : 0,
      })
    );
  }
}
