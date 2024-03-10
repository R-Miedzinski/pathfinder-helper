import { Component, OnDestroy, OnInit } from '@angular/core';
import keepOrder from 'src/app/shared/helpers/keepOrder';
import { Store } from '@ngrx/store';
import { GameState } from '../ngrx/game-reducer';
import * as GameActions from '../ngrx/game-actions';
import * as GameSelectors from '../ngrx/game-selector';
import { AbilitiesService } from '../services/abilities.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GameDataService } from '../services/game-data.service';
import { Subject, takeUntil } from 'rxjs';
import { isEqual } from 'lodash';
import { FeatsService } from '../services/feats.service';
import {
  Abilities,
  Ability,
  AbilityBoost,
  AbilityBoostType,
  Alignment,
  BackgroundData,
  ClassData,
  Feat,
  Race,
  RaceData,
} from 'rpg-app-shared-package/dist/public-api';

@Component({
  selector: 'app-new-character',
  templateUrl: './new-character.component.html',
  styleUrls: ['./new-character.component.scss'],
})
export class NewCharacterComponent implements OnInit, OnDestroy {
  protected races = Race;
  protected alignments = Alignment;
  protected boostTypes = AbilityBoostType;
  protected keepOrderLocal = keepOrder;
  protected chooseRaceForm!: FormGroup;
  protected boostsForm!: FormGroup;
  protected backgroundForm!: FormGroup;
  protected chooseClassForm!: FormGroup;
  protected eqForm!: FormGroup;
  protected detailsForm!: FormGroup;

  protected raceData?: RaceData;
  protected raceFeatNames: string[] = [];
  protected raceFeats: Feat[] = [];
  protected backgrounds: { id: string; name: string }[] = [];
  protected chosenBackground?: BackgroundData;
  protected classes: { id: string; name: string }[] = [];
  protected chosenClass?: ClassData;

  private abilities!: Ability[];
  private readonly ngDestroyed$: Subject<void> = new Subject();

  constructor(
    private fb: FormBuilder,
    private store: Store<GameState>,
    private abilitiesService: AbilitiesService,
    private gameDataService: GameDataService,
    private featsService: FeatsService
  ) {}

  public ngOnInit(): void {
    this.initCharacter();
    this.initRaceForm();
    this.initBackgroundForm();
    this.initClassForm();
    this.initEqForm();
    this.initDetailsForm();
  }

  public ngOnDestroy(): void {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  protected raceChange(): void {
    this.gameDataService
      .getRaceBonuses(this.chooseRaceForm.get('race')!.value)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: raceData => {
          this.raceData = undefined;
          this.initBoostsForm([], []);
          this.initBoostsForm(raceData.boosts, raceData.flaws);
          this.raceData = raceData;
          this.handleRaceFeatsFetch();
        },
      });
  }

  protected get boosts(): FormArray {
    return this.boostsForm.get('boostsArray') as FormArray;
  }

  protected get flaws(): FormArray {
    return this.boostsForm.get('flawsArray') as FormArray;
  }

  protected get backgroundBoosts(): FormArray {
    return this.backgroundForm.get('boosts') as FormArray;
  }

  private initCharacter(): void {
    this.store
      .select(GameSelectors.getAbilities)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: abilities => {
          if (!isEqual(this.abilities, abilities)) {
            this.abilities = abilities;
            this.abilitiesService.recalculateAbilities();
          }
        },
      });
  }

  private initRaceForm(): void {
    this.chooseRaceForm = this.fb.group({
      race: ['', Validators.required],
    });
  }

  private initBoostsForm(boosts: AbilityBoost[], flaws: AbilityBoost[]): void {
    this.boostsForm = this.fb.group({
      boostsArray: this.fb.array([]),
      flawsArray: this.fb.array([]),
    });

    boosts.forEach(boost =>
      this.boosts?.push(
        this.fb.group({
          boost: [
            boost.type === AbilityBoostType.free
              ? Abilities.str
              : boost.abilities[0],
          ],
        })
      )
    );

    flaws.forEach(flaw =>
      this.flaws?.push(
        this.fb.group({
          flaw: [
            flaw.type === AbilityBoostType.free
              ? Abilities.str
              : flaw.abilities[0],
          ],
        })
      )
    );
  }

  private initBackgroundForm(): void {
    this.backgroundForm = this.fb.group({
      background: [''],
      boosts: this.fb.array([]),
    });

    this.gameDataService.getBackgrounds().subscribe({
      next: (value: { id: string; name: string }[]) => {
        this.backgrounds = value;
      },
    });

    this.backgroundForm
      .get('background')
      ?.valueChanges.pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: (id: string) => {
          this.gameDataService.getBackgorundData(id).subscribe({
            next: (data: BackgroundData) => {
              this.initBackgroundBoostsForm([]);

              this.chosenBackground = data;
              this.initBackgroundBoostsForm(this.chosenBackground.boosts);
            },
          });
        },
      });
  }

  private initClassForm(): void {
    this.chooseClassForm = this.fb.group({
      class: [''],
    });

    this.gameDataService.getClasses().subscribe({
      next: (value: { id: string; name: string }[]) => {
        this.classes = value;
      },
    });

    this.chooseClassForm
      .get('class')
      ?.valueChanges.pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: (id: string) => {
          this.gameDataService.getClassData(id).subscribe({
            next: (data: ClassData) => {
              this.chosenClass = data;
            },
          });
        },
      });
  }

  private initEqForm(): void {}

  private initDetailsForm(): void {
    this.detailsForm = this.fb.group({
      name: ['', Validators.required],
      backstory: this.fb.group({
        story: ['', Validators.required],
        alignment: [Alignment.N, Validators.required],
        nationality: [''],
        ethnicity: [''],
        deity: [''],
        age: [''],
        gender: [''],
        pronouns: [''],
        height: [''],
        weight: [''],
        appearence: [''],
        attitude: [''],
        beliefs: [''],
        likes: [''],
        dislikes: [''],
        notes: [''],
      }),
    });

    this.detailsForm
      .get('name')
      ?.valueChanges.pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: name => this.store.dispatch(GameActions.saveNameAction({ name })),
      });

    this.detailsForm
      .get('backstory')
      ?.valueChanges.pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: backstory =>
          this.store.dispatch(GameActions.saveBackstoryAction({ backstory })),
      });
  }

  private handleRaceFeatsFetch(): void {
    if (this.raceData) {
      this.featsService
        .getFeatsToAdd(1, undefined, this.raceData.name)
        .pipe(takeUntil(this.ngDestroyed$))
        .subscribe({
          next: (feats: Feat[]) => {
            this.raceFeats = feats;
            this.raceFeatNames = feats.map(feat => feat.name);
          },
        });
    }
  }

  private initBackgroundBoostsForm(boosts: AbilityBoost[]): void {
    this.backgroundBoosts.clear();
    boosts.forEach(boost => {
      this.backgroundBoosts.push(
        this.fb.group({
          boost: [
            boost.type === AbilityBoostType.free
              ? Abilities.str
              : boost.abilities[0],
          ],
        })
      );
    });
  }
}
