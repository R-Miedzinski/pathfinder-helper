import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  Abilities,
  AbilityBoost,
  AbilityBoostType,
  Feat,
  Race,
  RaceData,
} from 'rpg-app-shared-package/dist/public-api';
import keepOrder from 'src/app/shared/helpers/keepOrder';
import { GameDataService } from '../../services/game-data.service';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeatsService } from '../../services/feats.service';

@Component({
  selector: 'app-choose-race-form',
  templateUrl: './choose-race-form.component.html',
  styleUrls: ['./choose-race-form.component.scss'],
})
export class ChooseRaceFormComponent implements OnInit, OnDestroy {
  @Output() race: EventEmitter<RaceData> = new EventEmitter();
  @Output() abilities: EventEmitter<{
    boosts: Abilities[];
    flaws: Abilities[];
  }> = new EventEmitter();
  @Output() heritageFeat: EventEmitter<Feat> = new EventEmitter();
  @Output() ancestryFeat: EventEmitter<Feat> = new EventEmitter();

  protected chooseRaceForm: FormGroup = new FormGroup({});
  protected boostsForm: FormGroup = new FormGroup({});
  protected raceData?: RaceData;
  protected chosenHeritageFeat?: Feat;
  protected chosenAncestryFeat?: Feat;
  protected heritageFeats: Feat[] = [];
  protected raceFeats: Feat[] = [];
  protected darkvision$: Observable<Feat> = new Observable();

  protected readonly keepOrderLocal = keepOrder;
  protected readonly races = Race;
  protected readonly boostTypes = AbilityBoostType;

  private readonly ngDestroyed$: Subject<void> = new Subject();

  constructor(
    private fb: FormBuilder,
    private gameDataService: GameDataService,
    private featsService: FeatsService
  ) {}

  public ngOnInit(): void {
    this.initRaceForm();
  }

  public ngOnDestroy(): void {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  protected get boosts(): FormArray {
    return this.boostsForm.get('boostsArray') as FormArray;
  }

  protected get flaws(): FormArray {
    return this.boostsForm.get('flawsArray') as FormArray;
  }

  protected raceChange(): void {
    const chosenRace = this.chooseRaceForm?.get('race')?.value;

    if (chosenRace) {
      this.gameDataService
        .getRaceBonuses(chosenRace)
        .pipe(takeUntil(this.ngDestroyed$))
        .subscribe({
          next: raceData => {
            this.resetRaceChoice();

            this.raceData = raceData;
            this.race.emit(raceData);

            this.initBoostsForm(raceData.boosts, raceData.flaws);
            this.getDarkvisionFeat();
            this.handleRaceFeatsFetch();
          },
        });
    }
  }

  private initRaceForm(): void {
    this.chooseRaceForm = this.fb.group({
      race: ['', Validators.required],
      heritageFeat: ['', Validators.required],
      ancestryFeat: ['', Validators.required],
    });

    this.chooseRaceForm
      .get('heritageFeat')
      ?.valueChanges.pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: featId => {
          this.chosenHeritageFeat = this.heritageFeats.find(
            feat => feat.id === featId
          );
          this.heritageFeat.emit(this.chosenHeritageFeat);
        },
      });

    this.chooseRaceForm
      .get('ancestryFeat')
      ?.valueChanges.pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: featId => {
          this.chosenAncestryFeat = this.raceFeats.find(
            feat => feat.id === featId
          );
          this.ancestryFeat.emit(this.chosenAncestryFeat);
        },
      });
  }

  private resetRaceChoice(): void {
    this.raceData = undefined;
    this.race.emit(undefined);

    this.initBoostsForm([], []);
    this.abilities.emit(undefined);

    this.chooseRaceForm?.get('heritageFeat')?.setValue('');
    this.heritageFeat.emit(undefined);

    this.chooseRaceForm?.get('ancestryFeat')?.setValue('');
    this.ancestryFeat.emit(undefined);
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

    if (this.boosts.valid && this.flaws.valid) {
      this.abilities.emit({
        boosts: this.boosts.value.map(
          (item: { boost: Abilities }) => item.boost
        ),
        flaws: this.flaws.value.map((item: { flaw: Abilities }) => item.flaw),
      });
    }

    this.boostsForm.valueChanges.pipe(takeUntil(this.ngDestroyed$)).subscribe({
      next: boostData => {
        if (this.boosts.valid && this.flaws.valid) {
          this.abilities.emit({
            boosts: this.boosts.value.map(
              (item: { boost: Abilities }) => item.boost
            ),
            flaws: this.flaws.value.map(
              (item: { flaw: Abilities }) => item.flaw
            ),
          });
        } else {
          this.abilities.emit(undefined);
        }
      },
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
      this.heritageFeats = [];

      this.featsService
        .getRaceFeatsToAdd(1, this.raceData.name)
        .pipe(takeUntil(this.ngDestroyed$))
        .subscribe({
          next: (feats: Feat[]) => {
            this.raceFeats = feats;
          },
        });

      this.featsService
        .getHeritageFeats(this.raceData.name)
        .pipe(takeUntil(this.ngDestroyed$))
        .subscribe({
          next: (feats: Feat[]) => {
            this.heritageFeats = feats;
          },
        });
    }
  }
}
