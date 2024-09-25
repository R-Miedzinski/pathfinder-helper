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
import { LevelUpBonusesService } from '../services/level-up-bonuses.service';
import { ActivatedRoute, Router } from '@angular/router';

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

  protected readonly proficiencies = Proficiency;
  private characterData?: SeedCharacterData;
  private readonly ngDestroyed$: Subject<void> = new Subject();

  constructor(
    protected readonly newCharacterService: NewCharacterService,
    private store: Store<GameState>,
    private gameDataService: GameDataService,
    private featsService: FeatsService,
    private levelUpBonusesService: LevelUpBonusesService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.levelUpBonusesService.reset();
    this.resetRemainingChoicesForm();

    this.newCharacterService.skills = [];
    this.newCharacterService.languages = [];

    this.initAdditionalChoicesForm();
  }

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
      this.gatherSkillProficiencies();
    } else if (event.selectedIndex === 7) {
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
      this.gameDataService
        .saveNewCharacter(this.characterData)
        .pipe(takeUntil(this.ngDestroyed$))
        .subscribe({
          next: res => {
            this.router.navigate(['../', this.gameDataService.gameId], {
              queryParams: { hasCharacter: 'T' },
              relativeTo: this.route,
            });
            console.log(res);
          },
        });
    }
  }

  private initAdditionalChoicesForm(): void {
    this.additionalSkills.valueChanges
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: skills => {
          this.newCharacterService.skills = skills;
        },
      });

    this.addLanguageControl.valueChanges
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: languages => {
          this.newCharacterService.languages = languages;
        },
      });
  }

  private resetRemainingChoicesForm(): void {
    this.chosenSkills = this.newCharacterService.skills ?? [];
    this.skillsToChange = 0;
    this.additionalSkills.setValue(this.newCharacterService.skills ?? []);

    this.languagesToAdd = 0;
    this.addLanguageControl.setValue(this.newCharacterService.languages ?? []);
  }

  private initLanguageForm(): void {
    const { languagesToAdd, initialLanguages } =
      this.newCharacterService.initLanguages();
    this.languagesToAdd = languagesToAdd;

    this.addLanguageControl.setValue(initialLanguages);
  }

  private gatherSkillProficiencies() {
    this.featsService
      .getFeats(this.newCharacterService.gatherFeats())
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: characterFeats => {
          const { skillsToChange, chosenSkills } =
            this.newCharacterService.initAdditionalSkills(characterFeats);

          this.chosenSkills = chosenSkills;

          this.skillsToChange =
            skillsToChange - this.additionalSkills.value.length;
        },
      });
  }
}
