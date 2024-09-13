import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Abilities,
  AbilityBoost,
  AbilityBoostType,
  Classes,
  DisplayInitClassData,
  EffectChoice,
  LevelBonus,
  LevelBonusCategory,
} from 'rpg-app-shared-package/dist/public-api';
import { Subject, takeUntil } from 'rxjs';
import { GameDataService } from '../../services/game-data.service';
import { FeatsService } from '../../services/feats.service';
import { LevelUpBonusesService } from '../../services/level-up-bonuses.service';

@Component({
  selector: 'app-choose-class-form',
  templateUrl: './choose-class-form.component.html',
  styleUrls: ['./choose-class-form.component.scss'],
})
export class ChooseClassFormComponent implements OnInit, OnDestroy {
  @Output() classData: EventEmitter<DisplayInitClassData> = new EventEmitter();
  @Output() boosts: EventEmitter<Abilities[]> = new EventEmitter();

  protected chooseClassForm: FormGroup = new FormGroup({});
  protected classes: { id: string; name: Classes }[] = [];
  protected chosenClass?: DisplayInitClassData;
  protected classFeatures?: LevelBonus[];
  protected featuresArrayForm: FormGroup = new FormGroup({});

  protected readonly boostTypes = AbilityBoostType;
  private readonly ngDestroyed$: Subject<void> = new Subject();

  constructor(
    private gameDataService: GameDataService,
    private fb: FormBuilder,
    private levelUpBonusesService: LevelUpBonusesService
  ) {}

  public ngOnInit(): void {
    this.initClassForm();
  }

  public ngOnDestroy(): void {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  public get classBoosts(): FormArray<FormGroup> {
    return this.chooseClassForm.get('boosts') as FormArray;
  }

  public get featuresArray(): FormArray {
    return this.featuresArrayForm.get('features') as FormArray;
  }

  private initClassForm(): void {
    this.chooseClassForm = this.fb.group({
      class: ['', Validators.required],
      boosts: this.fb.array([]),
    });

    this.featuresArrayForm = this.fb.group({
      features: this.fb.array([]),
    });

    this.gameDataService.getClasses().subscribe({
      next: (value: { id: string; name: Classes }[]) => {
        this.classes = value;
      },
    });

    this.chooseClassForm
      .get('class')
      ?.valueChanges.pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: (id: string) => {
          this.gameDataService.getClassData(id).subscribe({
            next: (data: DisplayInitClassData) => {
              this.resetData();

              this.chosenClass = data;
              this.initClassFeaturesForm(this.chosenClass.name);
              this.initClassBoostsForm(this.chosenClass.boosts);
              this.classData.emit(this.chosenClass);
            },
          });
        },
      });
  }

  private resetData(): void {
    this.chosenClass = undefined;
    this.classData.emit(undefined);

    this.initClassBoostsForm([]);
    this.boosts.emit(undefined);

    this.classFeatures = undefined;

    this.featuresArray.reset();
  }

  private initClassBoostsForm(boosts: AbilityBoost[]): void {
    this.classBoosts.clear();
    boosts.forEach(boost => {
      this.classBoosts.push(
        this.fb.group({
          boost: [
            boost.type === AbilityBoostType.free
              ? Abilities.str
              : boost.abilities[0],
            Validators.required,
          ],
        })
      );
    });

    this.classBoosts.valueChanges.pipe(takeUntil(this.ngDestroyed$)).subscribe({
      next: boosts => {
        if (this.classBoosts.valid) {
          this.boosts.emit(
            this.classBoosts.value.map(
              (item: { boost: Abilities }) => item.boost
            )
          );
        } else {
          this.boosts.emit(undefined);
        }
      },
    });
  }

  private initClassFeaturesForm(className: string): void {
    this.gameDataService
      .getClassLevelData(className, 1)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: data => {
          this.classFeatures = data;

          this.featuresArrayForm = this.fb.group({
            features: this.fb.array(
              this.classFeatures.map(item => {
                const entry = this.fb.group({
                  bonusCategory: item.category,
                  data: null,
                });

                return entry;
              })
            ),
          });

          this.featuresArrayForm
            .get('features')
            ?.valueChanges.pipe(takeUntil(this.ngDestroyed$))
            .subscribe({
              next: (
                levelBonuses: {
                  bonusCategory: LevelBonusCategory;
                  data: any;
                }[]
              ) => {
                this.levelUpBonusesService.selectedBonuses = levelBonuses;
              },
            });
        },
      });
  }
}
