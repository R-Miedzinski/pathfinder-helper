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
  SeedCharacterData,
} from 'rpg-app-shared-package/dist/public-api';
import { StepperSelectionEvent } from '@angular/cdk/stepper';

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
          this.chooseRaceForm.get('feat')?.setValue('');

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

  protected get classBoosts(): FormArray {
    return this.chooseClassForm.get('boosts') as FormArray;
  }

  protected onStepChanged(event: StepperSelectionEvent): void {
    if (event.selectedIndex === 5) {
      const characterData: SeedCharacterData = {
        id: '0',
        name: this.detailsForm.get('name')?.value,
        class: this.chosenClass!.name,
        race: this.raceData!.name,
        level: 1,
        ancestryFeats: [this.chooseRaceForm.get('feat')?.value],
        classFeats: [],
        generalFeats: [],
        skillFeats: [],
        bonusFeats: [],
        boosts: [
          ...this.boosts.value.map((item: { boost: Abilities }) => item.boost),
          ...this.backgroundForm
            .get('boosts')
            ?.value.map((item: { boost: Abilities }) => item.boost),
          ...this.chooseClassForm
            .get('boosts')
            ?.value.map((item: { boost: Abilities }) => item.boost),
        ],
        flaws: this.flaws.value.map((item: { boost: Abilities }) => item.boost),
        savingThrows: [...(this.chosenClass?.savingThrows ?? [])],
        skills: [
          ...(this.chosenBackground?.proficiencies ?? []),
          ...(this.chosenClass?.proficiencies ?? []),
        ],
        attacks: this.chosenClass?.weaponProficiencies ?? [],
        defences: this.chosenClass?.armorProficiencies ?? [],
        inventory: [],
        equippedItems: [],
        investedItems: [],
        spells: [],
        actions: [],
        backstory: this.detailsForm.get('backstory')?.value,
      };

      console.log(characterData);

      this.gameDataService
        .previewNewCharacter(characterData)
        .pipe(takeUntil(this.ngDestroyed$))
        .subscribe({
          next: character => {
            this.store.dispatch(GameActions.saveCharacterAction({ character }));
          },
        });
    }
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
      feat: ['', Validators.required],
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
            Validators.required,
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
            Validators.required,
          ],
        })
      )
    );
  }

  private initBackgroundForm(): void {
    this.backgroundForm = this.fb.group({
      background: ['', Validators.required],
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
      class: ['', Validators.required],
      boosts: this.fb.array([]),
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
              this.initClassBoostsForm([]);

              this.chosenClass = data;
              this.initClassBoostsForm(this.chosenClass.boosts);
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
        .getFeatsToAdd(10, undefined, this.raceData.name) // change level to 1
        .pipe(takeUntil(this.ngDestroyed$))
        .subscribe({
          next: (feats: Feat[]) => {
            this.raceFeats = feats;
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
            Validators.required,
          ],
        })
      );
    });
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
  }
}
