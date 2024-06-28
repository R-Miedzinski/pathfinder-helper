import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  Abilities,
  Classes,
  EffectChoice,
  FeatCategory,
  LevelBonus,
  LevelBonusCategory,
  Race,
} from 'rpg-app-shared-package/dist/public-api';
import { Observable, Subject, map, of, takeUntil, tap } from 'rxjs';
import { FeatsService } from 'src/app/feature/game/services/feats.service';
import {
  Form,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-level-bonus',
  templateUrl: './level-bonus.component.html',
  styleUrls: ['./level-bonus.component.scss'],
})
export class LevelBonusComponent implements OnInit, OnDestroy {
  @Input() levelBonus?: LevelBonus;
  @Input() charClass?: Classes;
  @Input() level: number = 1;
  @Input() race?: Race;
  @Input() valueControl!: FormGroup;

  protected feats$: Observable<string[]> = new Observable();
  protected addFeatChoice: EffectChoice[] = [];
  protected boostsArrayForm: FormGroup = new FormGroup({});

  protected readonly bonusCategory = LevelBonusCategory;
  private readonly ngDestroyed$: Subject<void> = new Subject();

  constructor(private featsService: FeatsService, private fb: FormBuilder) {}

  public ngOnInit(): void {
    switch (this.levelBonus?.category) {
      case LevelBonusCategory.addFeat:
        this.feats$ = of(this.levelBonus.payload!.featId).pipe(
          tap(feats =>
            this.valueControl.get('data')?.setValue({
              feats,
              choices: [],
            })
          )
        );
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
        this.initBoostsChoice();
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

  protected get boostsArray(): FormArray {
    return this.boostsArrayForm.get('boosts') as FormArray;
  }

  protected onAddFeatEffectChoice(choice: EffectChoice, feat: string): void {
    if (!!choice) {
      const currentId = this.addFeatChoice?.findIndex(
        item => item?.featId === feat
      );

      if (currentId === -1) {
        this.addFeatChoice.push(choice);
      } else {
        this.addFeatChoice[currentId] = choice;
      }

      const feats = this.valueControl.get('data')?.value.feats;

      this.valueControl.get('data')?.setValue({
        feats,
        choices: this.addFeatChoice,
      });
    }
  }

  private initFeatsChoice(category: FeatCategory, trait?: string): void {
    this.feats$ = this.featsService
      .getFeatsQuery(this.level, category, trait)
      .pipe(
        takeUntil(this.ngDestroyed$),
        map(feats => feats.map(item => item.id))
      );
  }

  private initBoostsChoice(): void {
    this.boostsArrayForm = this.fb.group({
      boosts: this.fb.array([]),
    });

    for (let index = 0; index < 4; index++) {
      this.boostsArray.push(
        this.fb.group({
          boost: [null, Validators.required],
        })
      );
    }

    this.boostsArray.valueChanges.pipe(takeUntil(this.ngDestroyed$)).subscribe({
      next: (data: { boost: Abilities }[]) => {
        if (this.boostsArray.valid) {
          this.valueControl
            .get('data')
            ?.setValue(data.map(entry => entry.boost));
        } else {
          this.valueControl.get('data')?.setValue(null);
        }
      },
    });
  }
}
