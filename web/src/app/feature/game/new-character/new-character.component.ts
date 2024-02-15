import { Component, OnDestroy, OnInit } from '@angular/core';
import { Race } from '../models/enums/race';
import keepOrder from 'src/app/shared/helpers/keepOrder';
import { Store } from '@ngrx/store';
import { GameState } from '../ngrx/game-reducer';
import * as GameActions from '../ngrx/game-actions';
import * as GameSelectors from '../ngrx/game-selector';
import { AbilitiesService } from '../services/abilities.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GameDataService } from '../services/game-data.service';
import { Subject, takeUntil } from 'rxjs';
import { RaceData } from '../models/interfaces/race-data';
import { isEqual } from 'lodash';
import { Ability } from '../models/interfaces/ability';
import { Alignment } from '../models/enums/alignment';

@Component({
  selector: 'app-new-character',
  templateUrl: './new-character.component.html',
  styleUrls: ['./new-character.component.scss'],
})
export class NewCharacterComponent implements OnInit, OnDestroy {
  protected races = Race;
  protected alignments = Alignment;
  protected keepOrderLocal = keepOrder;
  protected chooseRaceForm!: FormGroup;
  protected backgroundForm!: FormGroup;
  protected chosseClassForm!: FormGroup;
  protected eqForm!: FormGroup;
  protected detailsForm!: FormGroup;
  protected raceData?: RaceData;
  private abilities!: Ability[];
  private readonly ngDestroyed$: Subject<void> = new Subject();

  constructor(
    private fb: FormBuilder,
    private store: Store<GameState>,
    private abilitiesService: AbilitiesService,
    private gameDataService: GameDataService
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
          if (!isEqual(raceData, this.raceData)) {
            if (this.raceData !== undefined) {
              this.raceData?.flaws.forEach(flaw =>
                this.abilitiesService.applyBoost(
                  this.abilities.find(ability => ability.name === flaw)!
                )
              );
              this.raceData?.boosts.forEach(boost =>
                this.abilitiesService.applyFlaw(
                  this.abilities.find(ability => ability.name === boost)!
                )
              );
            }

            this.raceData = raceData;

            this.raceData?.flaws.forEach(flaw =>
              this.abilitiesService.applyFlaw(
                this.abilities.find(ability => ability.name === flaw)!
              )
            );
            this.raceData?.boosts.forEach(boost =>
              this.abilitiesService.applyBoost(
                this.abilities.find(ability => ability.name === boost)!
              )
            );
          }
        },
      });
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
}
