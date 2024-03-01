import { Injectable, OnDestroy } from '@angular/core';
import { GameState } from '../ngrx/game-reducer';
import { Store } from '@ngrx/store';
import * as GameActions from '../ngrx/game-actions';
import * as GameSelectors from '../ngrx/game-selector';
import { Subject, takeUntil } from 'rxjs';
import { cloneDeep } from 'lodash';
import { SkillsService } from './skills.service';
import { Ability } from '../../../shared/models/interfaces/ability';

@Injectable()
export class AbilitiesService implements OnDestroy {
  protected abilities: Ability[] = [];
  private readonly ngOnDestroy$ = new Subject<void>();

  constructor(
    private store: Store<GameState>,
    private skillsService: SkillsService
  ) {
    this.store
      .select(GameSelectors.getAbilities)
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe({
        next: (abilities: Ability[]) => {
          this.abilities = abilities;
        },
      });
  }

  public ngOnDestroy(): void {
    this.ngOnDestroy$.next();
    this.ngOnDestroy$.complete();
  }

  public abilityChangeHandler(ability: Ability): void {
    const abilityToUpdate = cloneDeep(ability);
    abilityToUpdate.modifier = this.valToMod(ability.score);

    this.store.dispatch(
      GameActions.saveAbilityAction({ ability: abilityToUpdate })
    );

    if (ability.modifier !== abilityToUpdate.modifier) {
      console.log('reacalculating skills after ability change');
      this.skillsService.recalculateSkills();
    }
  }

  public recalculateAbilities(): void {
    this.abilities.forEach(ability => this.abilityChangeHandler(ability));
  }

  public applyBoost(ability: Ability): void {
    let newAbilityScore = ability.score;

    newAbilityScore += ability.score >= 18 ? 1 : 2;

    const newAbility = cloneDeep(ability);
    newAbility.score = newAbilityScore;

    this.store.dispatch(GameActions.saveAbilityAction({ ability: newAbility }));
  }

  public applyFlaw(ability: Ability): void {
    let newAbilityScore = ability.score;

    newAbilityScore -= ability.score > 18 ? 1 : 2;

    const newAbility = cloneDeep(ability);
    newAbility.score = newAbilityScore;

    this.store.dispatch(GameActions.saveAbilityAction({ ability: newAbility }));
  }

  private valToMod(value: number): number {
    return Math.floor((value - 10) / 2);
  }
}
