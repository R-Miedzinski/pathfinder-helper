import { Injectable, OnDestroy } from '@angular/core';
import {
  Abilities,
  EffectChoice,
  LevelBonusCategory,
  Skill,
} from 'rpg-app-shared-package/dist/public-api';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LevelUpBonusesService implements OnDestroy {
  private _feats: string[] = [];
  private _effects: EffectChoice[] = [];
  private _boosts: Abilities[] = [];
  private _skills: Skill[] = [];

  private _selectedBonuses: BehaviorSubject<
    { bonusCategory: LevelBonusCategory; data: any }[]
  > = new BehaviorSubject(
    [] as { bonusCategory: LevelBonusCategory; data: any }[]
  );
  private handlersMap: Record<LevelBonusCategory, (data: any) => void>;

  private readonly ngDestroyed$: Subject<void> = new Subject();

  constructor() {
    this.handlersMap = this.createHandlersMap();
    this.handleBonusesChange();
  }

  public set selectedBonuses(
    data: { bonusCategory: LevelBonusCategory; data: any }[]
  ) {
    this._selectedBonuses.next(data);
  }

  public get feats(): string[] {
    return this._feats;
  }

  public get effects(): EffectChoice[] {
    return this._effects;
  }

  public get boosts(): Abilities[] {
    return this._boosts;
  }

  public get skills(): Skill[] {
    return this._skills;
  }

  public ngOnDestroy(): void {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  private createHandlersMap(): Record<LevelBonusCategory, (data: any) => void> {
    return {
      [LevelBonusCategory.addFeat]: this.addFeatHandler,
      [LevelBonusCategory.classFeat]: this.selectFeatHandler,
      [LevelBonusCategory.ancestralFeat]: this.selectFeatHandler,
      [LevelBonusCategory.generalFeat]: this.selectFeatHandler,
      [LevelBonusCategory.skillFeat]: this.selectFeatHandler,
      [LevelBonusCategory.replaceFeat]: this.replaceFeatHandler,
      [LevelBonusCategory.boost]: this.boostHandler,
      [LevelBonusCategory.skill]: this.skillHandler,
    };
  }

  private handleBonusesChange(): void {
    this._selectedBonuses.pipe(takeUntil(this.ngDestroyed$)).subscribe({
      next: levelBonuses => {
        this.resetData();
        levelBonuses.forEach(item => {
          this.handlersMap[item.bonusCategory](item.data);
        });
      },
    });
  }

  private addFeatHandler = (data: {
    feats: string[];
    choices: EffectChoice[];
  }): void => {
    if (data.feats?.length) {
      this._feats.push(...data.feats);
    }

    if (data.choices?.length) {
      this._effects.push(...data.choices);
    }
  };

  private selectFeatHandler = (data: string): void => {
    this._feats.push(data);
  };

  private replaceFeatHandler = (data: any): void => {};

  private boostHandler = (data: any): void => {};

  private skillHandler = (data: any): void => {};

  private resetData(): void {
    this._feats = [];
    this._effects = [];
    this._boosts = [];
    this._skills = [];
  }
}
