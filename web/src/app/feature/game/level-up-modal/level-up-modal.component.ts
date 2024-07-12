import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  Classes,
  LevelBonus,
  LevelBonusCategory,
  Proficiency,
  Race,
  SeedCharacterData,
  Skill,
} from 'rpg-app-shared-package/dist/public-api';
import * as GameActions from '../ngrx/game-actions';
import { GameDataService } from '../services/game-data.service';
import { Subject, takeUntil } from 'rxjs';
import { AppState } from 'src/app/core/ngrx/interfaces/app-state';
import { Store } from '@ngrx/store';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { LevelUpBonusesService } from '../services/level-up-bonuses.service';
import { LevelUpService } from '../services/level-up.service';

@Component({
  selector: 'app-level-up-modal',
  templateUrl: './level-up-modal.component.html',
  styleUrls: ['./level-up-modal.component.scss'],
})
export class LevelUpModalComponent implements OnDestroy, OnInit {
  protected bonusesArrayForm: FormGroup = new FormGroup({});
  protected isFormValid: boolean = false;
  protected skills: Skill[] = [];

  protected characterData?: SeedCharacterData;
  protected readonly bonusCategory = LevelBonusCategory;
  private readonly ngDestroyed$: Subject<void> = new Subject();

  constructor(
    @Inject(MAT_DIALOG_DATA)
    protected readonly data: {
      bonuses: LevelBonus[];
      charClass: Classes;
      race: Race;
      level: number;
      id: string;
      skills: Skill[];
      feats: string[];
    },
    private dialogRef: MatDialogRef<LevelUpModalComponent>,
    private fb: FormBuilder,
    private levelUpService: LevelUpService,
    private levelUpBonusesService: LevelUpBonusesService,
    private gameDataService: GameDataService,
    private store: Store<AppState>
  ) {}

  public get bonusesArray(): FormArray {
    return this.bonusesArrayForm.get('bonuses') as FormArray;
  }

  public ngOnInit(): void {
    this.levelUpBonusesService.reset();
    this.skills = this.data.skills.filter(item => item.level !== Proficiency.U);

    this.bonusesArrayForm = this.fb.group({
      bonuses: this.fb.array(
        this.data.bonuses.map(item => {
          const entry = this.fb.group({
            bonusCategory: item.category,
            data: null,
          });

          return entry;
        })
      ),
    });

    this.bonusesArrayForm
      .get('bonuses')
      ?.valueChanges.pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: (
          levelBonuses: {
            bonusCategory: LevelBonusCategory;
            data: any;
          }[]
        ) => {
          this.levelUpBonusesService.selectedBonuses = levelBonuses;

          this.isFormValid = levelBonuses.every(entry => !!entry.data);
        },
      });
  }

  public ngOnDestroy(): void {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  public closeDialog(submitChange: boolean) {
    if (submitChange && this.isFormValid && this.characterData) {
      this.gameDataService
        .patchCharacterData(this.characterData)
        .pipe(takeUntil(this.ngDestroyed$))
        .subscribe({
          next: response => {
            console.log('response receive', response);

            if (response.ok) {
              this.dialogRef.close({
                characterChanged: true,
              });
            }
          },
        });
    } else {
      this.dialogRef.close({
        characterChanged: false,
      });
    }
  }

  onStepChanged(event: StepperSelectionEvent): void {
    if (event.selectedIndex === 1) {
      this.levelUpService
        .getNewCharacterData()
        .pipe(takeUntil(this.ngDestroyed$))
        .subscribe({
          next: seedData => {
            this.characterData = seedData;

            this.gameDataService
              .previewNewCharacter(this.characterData)
              .pipe(takeUntil(this.ngDestroyed$))
              .subscribe({
                next: character => {
                  this.store.dispatch(
                    GameActions.saveCharacterAction({ character })
                  );
                },
              });
          },
        });
    }
  }
}
