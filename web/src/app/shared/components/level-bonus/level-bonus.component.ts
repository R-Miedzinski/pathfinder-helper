import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  Abilities,
  Classes,
  EffectChoice,
  FeatCategory,
  LevelBonus,
  LevelBonusCategory,
  Proficiency,
  Race,
  Skill,
} from 'rpg-app-shared-package/dist/public-api';
import { Observable, Subject, map, of, takeUntil, tap } from 'rxjs';
import { FeatsService } from 'src/app/feature/game/services/feats.service';
import {
  FormArray,
  FormBuilder,
  FormControl,
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
  @Input({ required: false }) skills: Skill[] = [];
  @Input({ required: false }) featsInPossession: string[] = [];

  protected feats$: Observable<string[]> = new Observable();
  protected addFeatChoice: EffectChoice[] = [];
  protected featReplaceForm: FormGroup = new FormGroup({});
  protected boostsArrayForm: FormGroup = new FormGroup({});
  protected maxSkillLevel: Proficiency = Proficiency.U;
  protected skillIncreaseControl: FormControl = new FormControl();

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
            map(feats => feats.map(item => item._id))
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
        this.initFeatReplace();
        return;
      case LevelBonusCategory.boost:
        this.initBoostsChoice();
        return;
      case LevelBonusCategory.skill:
        this.initSkillIncrease();
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

  protected onFeatReplaceChoice(event: EffectChoice): void {
    if (!!event) {
      this.featReplaceForm.get('choices')?.setValue(event);
    }
  }

  private initFeatsChoice(category: FeatCategory, trait?: string): void {
    this.feats$ = this.featsService
      .getFeatsQuery(this.level, category, trait)
      .pipe(
        takeUntil(this.ngDestroyed$),
        map(feats => feats.map(item => item._id))
      );
  }

  private initFeatReplace(): void {
    this.featReplaceForm = this.fb.group({
      toReplace: [this.levelBonus?.payload!.toReplace, Validators.required],
      replacement: [this.levelBonus?.payload!.toReplace, Validators.required],
      choices: undefined,
    });

    this.featReplaceForm.valueChanges
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: data => {
          if (this.featReplaceForm.valid) {
            this.valueControl.get('data')?.setValue(data);
          } else {
            this.valueControl.get('data')?.setValue(null);
          }
        },
      });
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

  private initSkillIncrease(): void {
    if (this.level < 7) {
      this.maxSkillLevel = Proficiency.E;
    } else if (this.level < 15) {
      this.maxSkillLevel = Proficiency.M;
    } else {
      this.maxSkillLevel = Proficiency.L;
    }

    this.skillIncreaseControl = this.fb.control([], Validators.required);

    this.skillIncreaseControl.valueChanges
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: skill => {
          if (this.skillIncreaseControl.valid) {
            this.valueControl.get('data')?.setValue(skill[0]);
          } else {
            this.valueControl.get('data')?.setValue(null);
          }
        },
      });
  }
}
