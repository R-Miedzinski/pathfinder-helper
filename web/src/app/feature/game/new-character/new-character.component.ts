import { Component, OnDestroy, OnInit } from '@angular/core';
import keepOrder from 'src/app/shared/helpers/keepOrder';
import { Store } from '@ngrx/store';
import { GameState } from '../ngrx/game-reducer';
import * as GameActions from '../ngrx/game-actions';
import * as GameSelectors from '../ngrx/game-selector';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { GameDataService } from '../services/game-data.service';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { FeatsService } from '../services/feats.service';
import {
  Abilities,
  AbilityBoost,
  AbilityBoostType,
  Alignment,
  BackgroundData,
  Classes,
  Feat,
  Race,
  RaceData,
  SeedCharacterData,
  DisplayInitClassData,
  Proficiency,
  Skill,
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
  protected additionalSkills: FormControl = new FormControl<Skill[]>([]);
  protected addLanguageControl: FormControl = new FormControl<string[]>([]);

  protected raceData?: RaceData;
  protected raceFeats: Feat[] = [];
  protected classFeats: Feat[] = [];
  protected backgrounds: { id: string; name: string }[] = [];
  protected chosenBackground?: BackgroundData;
  protected classes: { id: string; name: string }[] = [];
  protected chosenClass?: DisplayInitClassData;
  protected chosenSkills: Skill[] = [];
  protected skillsToChange: number = 0;
  protected languagesToAdd: number = 0;

  protected chosenRaceFeat?: Feat;
  protected chosenBackgroundFeats?: Feat[];
  protected chosenClassFeat?: Feat;
  protected darkvision$: Observable<Feat> = new Observable();
  protected abilityModifiers?: Record<Abilities, number>;

  protected readonly proficiencies = Proficiency;
  private readonly ngDestroyed$: Subject<void> = new Subject();

  constructor(
    private fb: FormBuilder,
    private store: Store<GameState>,
    private gameDataService: GameDataService,
    private featsService: FeatsService
  ) {}

  public ngOnInit(): void {
    this.initRaceForm();
    this.initBackgroundForm();
    this.initClassForm();
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
          this.getDarkvisionFeat();
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
    if (event.selectedIndex === 3) {
      this.calculateModifiers();
      this.resetRemainingChoicesForm();
      this.initLanguageForm();
      this.initAdditionalSkillsForm();
    } else if (event.selectedIndex === 6) {
      this.detailsForm
        .get('backstory')
        ?.get('languages')
        ?.setValue(this.addLanguageControl.value);

      const characterData: SeedCharacterData = {
        id: '0',
        name: this.detailsForm.get('name')?.value,
        class: this.chosenClass!.name,
        race: this.raceData!.name,
        level: 1,
        ancestryFeats: [this.chooseRaceForm.get('feat')?.value],
        classFeats: [this.chooseClassForm.get('feat')?.value],
        generalFeats: this.chosenBackground?.feats ?? [],
        skillFeats: [],
        bonusFeats: this.raceData?.darkvision
          ? [this.raceData?.darkvision]
          : [],
        boosts: [
          ...this.boosts.value.map((item: { boost: Abilities }) => item.boost),
          ...this.backgroundForm
            .get('boosts')
            ?.value.map((item: { boost: Abilities }) => item.boost),
          ...this.chooseClassForm
            .get('boosts')
            ?.value.map((item: { boost: Abilities }) => item.boost),
        ],
        flaws: this.flaws.value.map((item: { flaw: Abilities }) => item.flaw),
        savingThrows: [...(this.chosenClass?.savingThrows ?? [])],
        skills: this.additionalSkills.value,
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

  private initRaceForm(): void {
    this.chooseRaceForm = this.fb.group({
      race: ['', Validators.required],
      feat: ['', Validators.required],
    });

    this.chooseRaceForm
      .get('feat')
      ?.valueChanges.pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: featId =>
          (this.chosenRaceFeat = this.raceFeats.find(
            feat => feat.id === featId
          )),
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
              this.getBackgroundFeats(this.chosenBackground.feats ?? []);
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
      feat: ['', Validators.required],
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
            next: (data: DisplayInitClassData) => {
              this.initClassBoostsForm([]);
              this.chooseClassForm
                .get('feat')
                ?.setValue('', { emitEvent: false });
              this.chosenClassFeat = undefined;

              this.chosenClass = data;
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
        next: featId =>
          (this.chosenClassFeat = this.classFeats.find(
            feat => feat.id === featId
          )),
      });
  }

  private initDetailsForm(): void {
    this.detailsForm = this.fb.group({
      name: ['', Validators.required],
      backstory: this.fb.group({
        story: ['', Validators.required],
        alignment: [Alignment.N, Validators.required],
        languages: [[]],
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

  private getDarkvisionFeat(): void {
    const darkvision = this.raceData?.darkvision;
    if (darkvision) {
      this.darkvision$ = this.featsService
        .getFeats([darkvision])
        .pipe(map(list => list[0]));
    }
  }

  private handleRaceFeatsFetch(): void {
    if (this.raceData) {
      this.raceFeats = [];

      this.featsService
        .getRaceFeatsToAdd(1, this.raceData.name)
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

  private getBackgroundFeats(ids: string[]): void {
    if (ids.length) {
      this.featsService
        .getFeats(ids)
        .pipe(takeUntil(this.ngDestroyed$))
        .subscribe({
          next: feats => (this.chosenBackgroundFeats = feats),
        });
    }
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

  private calculateModifiers(): void {
    const boosts: Abilities[] = [
      ...this.boosts.value.map((item: { boost: Abilities }) => item.boost),
      ...this.backgroundForm
        .get('boosts')
        ?.value.map((item: { boost: Abilities }) => item.boost),
      ...this.chooseClassForm
        .get('boosts')
        ?.value.map((item: { boost: Abilities }) => item.boost),
    ];
    const flaws: Abilities[] = this.flaws.value.map(
      (item: { flaw: Abilities }) => item.flaw
    );

    const getModifier = (count: number): number => {
      let addedValue = 0;
      if (count <= 4) {
        addedValue = count * 2;
      } else {
        addedValue = 8 + (count - 4);
      }

      return Math.floor(addedValue / 2);
    };

    this.abilityModifiers = {
      [Abilities.str]: getModifier(
        boosts.filter(item => item === Abilities.str).length -
          flaws.filter(item => item === Abilities.str).length
      ),
      [Abilities.dex]: getModifier(
        boosts.filter(item => item === Abilities.dex).length -
          flaws.filter(item => item === Abilities.dex).length
      ),
      [Abilities.con]: getModifier(
        boosts.filter(item => item === Abilities.con).length -
          flaws.filter(item => item === Abilities.con).length
      ),
      [Abilities.wis]: getModifier(
        boosts.filter(item => item === Abilities.wis).length -
          flaws.filter(item => item === Abilities.wis).length
      ),
      [Abilities.int]: getModifier(
        boosts.filter(item => item === Abilities.int).length -
          flaws.filter(item => item === Abilities.int).length
      ),
      [Abilities.cha]: getModifier(
        boosts.filter(item => item === Abilities.cha).length -
          flaws.filter(item => item === Abilities.cha).length
      ),
    };
  }

  private resetRemainingChoicesForm(): void {
    this.chosenSkills = [];
    this.skillsToChange = 0;
    this.additionalSkills.setValue([]);
    this.addLanguageControl.setValue([]);
  }

  private initLanguageForm(): void {
    this.languagesToAdd = this.abilityModifiers
      ? this.abilityModifiers[Abilities.int]
      : 0;

    this.addLanguageControl.setValue(this.raceData?.languages);
  }

  private initAdditionalSkillsForm(): void {
    this.chosenSkills = (this.chosenBackground?.proficiencies ?? [])
      .concat(this.chosenClass?.proficiencies ?? [])
      .map(item => ({
        value: 0,
        ...item,
      }));

    this.skillsToChange =
      (this.chosenClass?.additionalProficiencies ?? 0) +
      (this.abilityModifiers ? this.abilityModifiers[Abilities.int] : 0);
  }
}
