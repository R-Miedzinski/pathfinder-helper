import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  Classes,
  FeatCategory,
  LevelBonus,
  LevelBonusCategory,
  Race,
} from 'rpg-app-shared-package/dist/public-api';
import { CustomFormControl } from '../custom-form-control/custom-form-control.component';
import { Observable, Subject, map, of, takeUntil } from 'rxjs';
import { FeatsService } from 'src/app/feature/game/services/feats.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-level-bonus',
  templateUrl: './level-bonus.component.html',
  styleUrls: ['./level-bonus.component.scss'],
})
export class LevelBonusComponent
  extends CustomFormControl<{ bonusCategory: string; data: any }>
  implements OnInit, OnDestroy
{
  @Input() levelBonus?: LevelBonus;
  @Input() charClass?: Classes;
  @Input() level: number = 1;
  @Input() race?: Race;

  protected feats$: Observable<string[]> = new Observable();
  protected valueControl: FormGroup = new FormGroup({});

  protected readonly bonusCategory = LevelBonusCategory;
  private readonly ngDestroyed$: Subject<void> = new Subject();

  constructor(private featsService: FeatsService, private fb: FormBuilder) {
    super();
  }

  public ngOnInit(): void {
    // TODO: identify bonus type
    // TODO: create form for identified data type
    this.initValueControl();

    switch (this.levelBonus?.category) {
      case LevelBonusCategory.addFeat:
        this.feats$ = of(this.levelBonus.payload!.featId);
        return;
      case LevelBonusCategory.classFeat:
        this.feats$ = this.featsService
          .getClassFeatsToAdd(this.level, this.charClass!)
          .pipe(
            takeUntil(this.ngDestroyed$),
            map(feats => feats.map(item => item.id))
          );
        return;
      case LevelBonusCategory.ancestralFeat:
        this.initFeatsChoice(FeatCategory.ancestry, this.race!);
        return;
      case LevelBonusCategory.generalFeat:
        this.initFeatsChoice(FeatCategory.general);
        return;
      case LevelBonusCategory.skillFeat:
        this.initFeatsChoice(FeatCategory.skill);
        return;
      case LevelBonusCategory.replaceFeat:
        return;
      case LevelBonusCategory.boost:
        return;
      case LevelBonusCategory.skill:
        return;
      default:
        console.log(
          'default case of level bonus',
          JSON.stringify(this.levelBonus)
        );
    }
  }

  public ngOnDestroy(): void {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  public override setDisabledState(isDisabled: boolean): void {}

  private initFeatsChoice(category: FeatCategory, trait?: string): void {
    this.feats$ = this.featsService
      .getFeatsQuery(this.level, category, trait)
      .pipe(
        takeUntil(this.ngDestroyed$),
        map(feats => feats.map(item => item.id))
      );
  }

  private initValueControl(): void {
    this.value = {
      bonusCategory: '',
      data: null,
    };

    this.valueControl = this.fb.group({
      bonusCategory: this.levelBonus?.category,
      data: undefined,
    });

    this.value.bonusCategory = this.levelBonus?.category ?? '';

    this.valueControl
      .get('data')
      ?.valueChanges.pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: data => {
          console.log('data changed for:', this.levelBonus, data);
          this.value.data = data;
          this.updateValue();
        },
      });
  }
}
