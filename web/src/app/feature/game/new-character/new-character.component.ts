import { Component, OnDestroy, OnInit } from '@angular/core';
import { Race } from '../../../shared/models/enums/race';
import keepOrder from 'src/app/shared/helpers/keepOrder';
import { Store } from '@ngrx/store';
import { GameState } from '../ngrx/game-reducer';
import * as GameActions from '../ngrx/game-actions';
import * as GameSelectors from '../ngrx/game-selector';
import { AbilitiesService } from '../services/abilities.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GameDataService } from '../services/game-data.service';
import { Subject, takeUntil } from 'rxjs';
import { RaceData } from '../../../shared/models/interfaces/race-data';
import { isEqual } from 'lodash';
import { Ability } from '../../../shared/models/interfaces/ability';
import { Alignment } from '../../../shared/models/enums/alignment';
import {
  AbilityBoost,
  AbilityBoostType,
} from 'src/app/shared/models/interfaces/ability-boost';
import { Abilities } from 'src/app/shared/models/enums/abilities';
import { FeatsService } from '../services/feats.service';
import { Feat } from 'src/app/shared/models/interfaces/feat';

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
  protected chosseClassForm!: FormGroup;
  protected eqForm!: FormGroup;
  protected detailsForm!: FormGroup;

  protected raceData?: RaceData;
  protected raceFeatNames: string[] = [];
  protected raceFeats: Feat[] = [];

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
          this.handleFeatsFetch();
        },
      });
  }

  protected get boosts(): FormArray {
    return this.boostsForm.get('boostsArray') as FormArray;
  }

  protected get flaws(): FormArray {
    return this.boostsForm.get('flawsArray') as FormArray;
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

  private initBackgroundForm(): void {}

  private initClassForm(): void {}

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

  private handleFeatsFetch(): void {
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
}
