import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { GameState } from '../ngrx/game-reducer';
import * as GameActions from '../ngrx/game-actions';
import * as GameSelectors from '../ngrx/game-selector';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { GameDataService } from '../services/game-data.service';
import { Subject, takeUntil } from 'rxjs';
import {
  Abilities,
  BackgroundData,
  Feat,
  RaceData,
  SeedCharacterData,
  DisplayInitClassData,
  Proficiency,
  Skill,
  Backstory,
  CharacterEffectType,
  GrantSkillProficiencyEffect,
  skillToAbilityMap,
} from 'rpg-app-shared-package/dist/public-api';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { FeatsService } from '../services/feats.service';

interface RaceChoiceControl {
  raceData?: RaceData;
  heritageFeat?: Feat;
  raceFeat?: Feat;
  boosts?: Abilities[];
  flaws?: Abilities[];
}

interface BackgroundChoiceControl {
  background?: BackgroundData;
  boosts?: Abilities[];
}

interface ClassChoiceControl {
  classData?: DisplayInitClassData;
  boosts?: Abilities[];
  classFeat?: Feat;
}

interface BackstoryChoiceControl {
  backstory?: Backstory;
  name?: string;
}

@Component({
  selector: 'app-new-character',
  templateUrl: './new-character.component.html',
  styleUrls: ['./new-character.component.scss'],
})
export class NewCharacterComponent implements OnInit, OnDestroy {
  protected featSkills: Skill[] = [];
  protected chosenSkills: Skill[] = [];
  protected skillsToChange: number = 0;
  protected languagesToAdd: number = 0;
  protected abilityModifiers?: Record<Abilities, number>;

  protected raceChoiceControl: FormGroup = new FormGroup({});
  protected backgroundChoiceControl: FormGroup = new FormGroup({});
  protected classChoiceControl: FormGroup = new FormGroup({});
  protected additionalSkills: FormControl = new FormControl<Skill[]>([]);
  protected addLanguageControl: FormControl = new FormControl<string[]>([]);
  protected equipmentControl: FormGroup = new FormGroup({});
  protected backstoryControl: FormGroup = new FormGroup({});
  protected gameIdControl: FormControl = new FormControl<string>('1');

  protected readonly proficiencies = Proficiency;
  private characterData?: SeedCharacterData;
  private readonly ngDestroyed$: Subject<void> = new Subject();

  constructor(
    private fb: FormBuilder,
    private store: Store<GameState>,
    private gameDataService: GameDataService,
    private featsService: FeatsService
  ) {}

  public ngOnInit(): void {
    this.initRaceChoiceForm();
    this.initBackgroundForm();
    this.initClassForm();
    this.initDetailsForm();
  }

  public ngOnDestroy(): void {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  public onRace(event: RaceData | undefined): void {
    this.raceChoiceControl.get('raceData')?.setValue(event);
  }

  public onRaceFeat(event: Feat | undefined): void {
    this.raceChoiceControl.get('raceFeat')?.setValue(event);
  }

  public onHeritageFeat(event: Feat | undefined): void {
    this.raceChoiceControl.get('heritageFeat')?.setValue(event);
  }

  public onRaceAbilities(event: {
    boosts?: Abilities[];
    flaws?: Abilities[];
  }): void {
    this.raceChoiceControl.get('boosts')?.setValue(event?.boosts);
    this.raceChoiceControl.get('flaws')?.setValue(event?.flaws);
  }

  public onBackground(event: BackgroundData): void {
    this.backgroundChoiceControl.get('background')?.setValue(event);
  }

  public onBackgroundBoosts(event: Abilities[]): void {
    this.backgroundChoiceControl.get('boosts')?.setValue(event);
  }

  public onClassData(event: DisplayInitClassData): void {
    this.classChoiceControl.get('classData')?.setValue(event);
  }

  public onClassBoosts(event: Abilities[]): void {
    this.classChoiceControl.get('boosts')?.setValue(event);
  }

  public onClassFeat(event: Feat): void {
    this.classChoiceControl.get('classFeat')?.setValue(event);
  }

  public onBackstory(event: Backstory): void {
    this.backstoryControl.get('backstory')?.setValue(event);
  }

  public onName(event: string): void {
    this.backstoryControl.get('name')?.setValue(event);
  }

  public get raceChoice(): RaceChoiceControl {
    return this.raceChoiceControl.value;
  }

  public get backgroundChoice(): BackgroundChoiceControl {
    return this.backgroundChoiceControl.value;
  }

  public get classChoice(): ClassChoiceControl {
    return this.classChoiceControl.value;
  }

  public get backstoryChoice(): BackstoryChoiceControl {
    return this.backstoryControl.value;
  }

  public characterFeats(): string[] {
    const featIds = [
      this.raceChoice!.heritageFeat!.id,
      this.raceChoice!.raceFeat!.id,
      ...(this.backgroundChoice.background?.feats ?? []),
      this.classChoice!.classFeat!.id,
    ];

    return featIds;
  }

  protected onStepChanged(event: StepperSelectionEvent): void {
    if (event.selectedIndex === 3) {
      this.calculateModifiers();
      this.resetRemainingChoicesForm();
      this.initLanguageForm();
      this.initAdditionalSkillsForm();
    } else if (event.selectedIndex === 6) {
      this.backgroundChoiceControl
        .get('backstory')
        ?.get('languages')
        ?.setValue(this.addLanguageControl.value);

      this.characterData = this.gatherCharacterData();

      console.log(this.characterData);

      this.gameDataService
        .previewNewCharacter(this.characterData)
        .pipe(takeUntil(this.ngDestroyed$))
        .subscribe({
          next: character => {
            this.store.dispatch(GameActions.saveCharacterAction({ character }));
          },
        });
    }
  }

  protected saveCharacter(): void {
    if (this.characterData) {
      let gameId = this.gameIdControl.value;

      if (!gameId) {
        gameId = '1';
      }

      this.gameDataService
        .saveNewCharacter(this.characterData, '1', gameId)
        .pipe(takeUntil(this.ngDestroyed$))
        .subscribe({
          next: res => console.log(res),
        });
    }
  }

  private initRaceChoiceForm(): void {
    this.raceChoiceControl = this.fb.group({
      raceData: [undefined, Validators.required],
      heritageFeat: [undefined, Validators.required],
      raceFeat: [undefined, Validators.required],
      boosts: [undefined, Validators.required],
      flaws: [undefined, Validators.required],
    });
  }

  private initBackgroundForm(): void {
    this.backgroundChoiceControl = this.fb.group({
      background: [undefined, Validators.required],
      boosts: [undefined, Validators.required],
    });
  }

  private initClassForm(): void {
    this.classChoiceControl = this.fb.group({
      classData: [undefined, Validators.required],
      boosts: [undefined, Validators.required],
      classFeat: [undefined, Validators.required],
    });
  }

  private initDetailsForm(): void {
    this.backstoryControl = this.fb.group({
      name: [undefined, Validators.required],
      backstory: [undefined, Validators.required],
    });
  }

  private gatherCharacterData(): SeedCharacterData {
    return {
      id: '0',
      name: this.backstoryChoice!.name!,
      class: this.classChoice!.classData!.name,
      race: this.raceChoice!.raceData!.name,
      background: this.backgroundChoice!.background!.id,
      level: 1,
      featChoices: [],
      feats: [
        this.raceChoice!.heritageFeat!.id,
        this.raceChoice!.raceFeat!.id,
        this.classChoice.classFeat?.id ?? '',
        ...(this.backgroundChoice?.background?.feats ?? []),
        this.raceChoice!.raceData?.darkvision ?? '',
      ],
      boosts: [
        ...(this.raceChoice.boosts ?? []),
        ...(this.backgroundChoice.boosts ?? []),
        ...(this.classChoice.boosts ?? []),
      ],
      flaws: this.raceChoice.flaws ?? [],
      savingThrows: [...(this.classChoice.classData?.savingThrows ?? [])],
      skills: this.additionalSkills.value.filter(
        (el: Skill) =>
          !this.featSkills
            // .map(skill => ({ name: skill.name, specialty: skill.specialty }))
            .includes(el) //{ name: el.name, specialty: el.specialty })
      ),
      attacks: this.classChoice.classData?.weaponProficiencies ?? [],
      defences: this.classChoice.classData?.armorProficiencies ?? [],
      inventory: [],
      equippedItems: [],
      investedItems: [],
      spells: [],
      actions: [],
      backstory: this.backstoryChoice!.backstory!,
    };
  }

  private calculateModifiers(): void {
    const boosts: Abilities[] = [
      ...(this.raceChoice.boosts ?? []),
      ...(this.backgroundChoice.boosts ?? []),
      ...(this.classChoice.boosts ?? []),
    ];
    const flaws: Abilities[] = this.raceChoice.flaws ?? [];

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

    this.addLanguageControl.setValue(this.raceChoice?.raceData?.languages);
  }

  // TODO: resolve feat skill profs for additional skill select
  // TODO: resolve repeating skills
  private initAdditionalSkillsForm(): void {
    this.featsService
      .getFeats(this.characterFeats())
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: characterFeats => {
          this.featSkills = characterFeats
            .map(feat =>
              feat.effect
                .filter(
                  effect => effect.effectType === CharacterEffectType.skill
                )
                .map(effect => {
                  const skill = (effect as GrantSkillProficiencyEffect).payload;
                  const mappedSkill: Skill = {
                    name: skill.skill,
                    level: skill.level,
                    value: 0,
                    ability: skillToAbilityMap[skill.skill],
                  };

                  if (skill.specialty) {
                    mappedSkill.specialty = skill.specialty;
                  }

                  return mappedSkill;
                })
            )
            .flat();

          this.chosenSkills = (
            this.backgroundChoice?.background?.proficiencies ?? []
          )
            .concat(this.classChoice.classData?.proficiencies ?? [])
            .map(item => ({
              value: 0,
              ...item,
            }))
            .concat(this.featSkills);

          this.skillsToChange =
            (this.classChoice.classData?.additionalProficiencies ?? 0) +
            (this.abilityModifiers ? this.abilityModifiers[Abilities.int] : 0);
        },
      });
  }
}
