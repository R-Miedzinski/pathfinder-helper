import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { GameState } from '../ngrx/game-reducer';
import * as GameActions from '../ngrx/game-actions';
import * as GameSelectors from '../ngrx/game-selector';
import { FormControl } from '@angular/forms';
import { GameDataService } from '../services/game-data.service';
import { Subject, takeUntil } from 'rxjs';
import {
  Abilities,
  BackgroundData,
  RaceData,
  SeedCharacterData,
  DisplayInitClassData,
  Proficiency,
  Skill,
  Backstory,
  EffectChoice,
} from 'rpg-app-shared-package/dist/public-api';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { FeatsService } from '../services/feats.service';
import { NewCharacterService } from '../services/new-character.service';

@Component({
  selector: 'app-new-character',
  templateUrl: './new-character.component.html',
  styleUrls: ['./new-character.component.scss'],
})
export class NewCharacterComponent implements OnInit, OnDestroy {
  protected chosenSkills: Skill[] = [];
  protected skillsToChange: number = 0;
  protected languagesToAdd: number = 0;

  protected additionalSkills: FormControl = new FormControl<Skill[]>([]);
  protected addLanguageControl: FormControl = new FormControl<string[]>([]);
  protected gameIdControl: FormControl = new FormControl<string>('1');

  protected readonly proficiencies = Proficiency;
  private characterData?: SeedCharacterData;
  private readonly ngDestroyed$: Subject<void> = new Subject();

  constructor(
    protected readonly newCharacterService: NewCharacterService,
    private store: Store<GameState>,
    private gameDataService: GameDataService,
    private featsService: FeatsService
  ) {}

  public ngOnInit(): void {}

  public ngOnDestroy(): void {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  public onRace(event: RaceData | undefined): void {
    this.newCharacterService.race = event;
  }

  public onRaceFeat(event: string | undefined): void {
    this.newCharacterService.ancestryFeat = event;
  }

  public onAncestryEffect(event: EffectChoice | undefined): void {
    this.newCharacterService.ancestryEffect = event;
  }

  public onHeritageFeat(event: string | undefined): void {
    this.newCharacterService.heritageFeat = event;
  }

  public onHeritageEffect(event: EffectChoice | undefined): void {
    this.newCharacterService.heritageEffect = event;
  }

  public onRaceAbilities(event: {
    boosts: Abilities[];
    flaws: Abilities[];
  }): void {
    this.newCharacterService.abilities = event;
  }

  public onBackground(event: BackgroundData): void {
    this.newCharacterService.background = event;
  }

  public onBackgroundBoosts(event: Abilities[]): void {
    this.newCharacterService.backgroundBoosts = event;
  }

  public onClassData(event: DisplayInitClassData): void {
    this.newCharacterService.classData = event;
  }

  public onClassBoosts(event: Abilities[]): void {
    this.newCharacterService.classBoosts = event;
  }

  public onClassFeat(event: string): void {
    this.newCharacterService.classFeat = event;
  }

  public onBackstory(event: Backstory): void {
    this.newCharacterService.backstory = event;
  }

  public onName(event: string): void {
    this.newCharacterService.characterName = event;
  }

  protected onStepChanged(event: StepperSelectionEvent): void {
    if (event.selectedIndex === 3) {
      this.newCharacterService.calculateModifiers();
      this.resetRemainingChoicesForm();
      this.initLanguageForm();
      this.initAdditionalSkillsForm();
    } else if (event.selectedIndex === 7) {
      this.newCharacterService.languages = this.addLanguageControl.value;

      this.characterData = this.newCharacterService.createNewCharacter();

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

  private resetRemainingChoicesForm(): void {
    this.chosenSkills = [];
    this.skillsToChange = 0;
    this.additionalSkills.reset();
    this.addLanguageControl.reset();
  }

  private initLanguageForm(): void {
    const { languagesToAdd, initialLanguages } =
      this.newCharacterService.initLanguages();
    this.languagesToAdd = languagesToAdd;

    this.addLanguageControl.setValue(initialLanguages);
  }

  // TODO: resolve feat skill profs for additional skill select
  // TODO: resolve repeating skills
  private initAdditionalSkillsForm(): void {
    this.featsService
      .getFeats(this.newCharacterService.gatherFeats())
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: characterFeats => {
          const { skillsToChange, chosenSkills } =
            this.newCharacterService.initAdditionalSkills(characterFeats);

          this.chosenSkills = chosenSkills;

          this.skillsToChange = skillsToChange;
        },
      });
  }
}
