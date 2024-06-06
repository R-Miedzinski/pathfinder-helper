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
  Feat,
} from 'rpg-app-shared-package/dist/public-api';
import { Subject, takeUntil } from 'rxjs';
import { GameDataService } from '../../services/game-data.service';
import { FeatsService } from '../../services/feats.service';

@Component({
  selector: 'app-choose-class-form',
  templateUrl: './choose-class-form.component.html',
  styleUrls: ['./choose-class-form.component.scss'],
})
export class ChooseClassFormComponent implements OnInit, OnDestroy {
  @Output() classData: EventEmitter<DisplayInitClassData> = new EventEmitter();
  @Output() boosts: EventEmitter<Abilities[]> = new EventEmitter();
  @Output() classFeat: EventEmitter<Feat> = new EventEmitter();

  protected chooseClassForm: FormGroup = new FormGroup({});
  protected classes: { id: string; name: Classes }[] = [];
  protected classFeats: Feat[] = [];
  protected chosenClassFeat?: Feat;
  protected chosenClass?: DisplayInitClassData;

  protected readonly boostTypes = AbilityBoostType;
  private readonly ngDestroyed$: Subject<void> = new Subject();

  constructor(
    private gameDataService: GameDataService,
    private featsService: FeatsService,
    private fb: FormBuilder
  ) {}

  public ngOnInit(): void {
    this.initClassForm();
  }

  public ngOnDestroy(): void {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  public get classBoosts(): FormArray {
    return this.chooseClassForm.get('boosts') as FormArray;
  }

  private initClassForm(): void {
    this.chooseClassForm = this.fb.group({
      class: ['', Validators.required],
      boosts: this.fb.array([]),
      feat: ['', Validators.required],
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
              this.classData.emit(this.chosenClass);
              this.initClassFeatsForm(this.chosenClass.name);
              this.initClassBoostsForm(this.chosenClass.boosts);
            },
          });
        },
      });

    this.chooseClassForm
      .get('feat')
      ?.valueChanges.pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: featId => {
          this.chosenClassFeat = this.classFeats.find(
            feat => feat.id === featId
          );
          this.classFeat.emit(this.chosenClassFeat);
        },
      });
  }

  private resetData(): void {
    this.chosenClass = undefined;
    this.classData.emit(undefined);

    this.initClassBoostsForm([]);
    this.boosts.emit(undefined);

    this.chooseClassForm.get('feat')?.setValue(undefined, { emitEvent: false });
    this.classFeat.emit(undefined);
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

  private initClassFeatsForm(charClass: Classes): void {
    if (this.chosenClass) {
      this.featsService
        .getClassFeatsToAdd(1, charClass)
        .pipe(takeUntil(this.ngDestroyed$))
        .subscribe({
          next: data => {
            this.classFeats = data;
          },
        });
    }
  }
}
