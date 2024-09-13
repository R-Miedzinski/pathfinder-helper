import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { GameDataService } from '../../services/game-data.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import {
  Abilities,
  AbilityBoost,
  AbilityBoostType,
  BackgroundData,
  Feat,
} from 'rpg-app-shared-package/dist/public-api';
import { FeatsService } from '../../services/feats.service';

@Component({
  selector: 'app-choose-background-form',
  templateUrl: './choose-background-form.component.html',
  styleUrls: ['./choose-background-form.component.scss'],
})
export class ChooseBackgroundFormComponent implements OnInit, OnDestroy {
  @Output() background: EventEmitter<BackgroundData> = new EventEmitter();
  @Output() boosts: EventEmitter<Abilities[]> = new EventEmitter();

  protected backgroundForm: FormGroup = new FormGroup({});
  protected backgrounds: { id: string; name: string }[] = [];
  protected chosenBackground?: BackgroundData;
  protected chosenBackgroundFeats?: Feat[];

  protected readonly boostTypes = AbilityBoostType;
  private readonly ngDestroyed$: Subject<void> = new Subject();

  constructor(
    private gameDataService: GameDataService,
    private featsService: FeatsService,
    private fb: FormBuilder
  ) {}

  public ngOnInit(): void {
    this.initBackgroundForm();
  }

  public ngOnDestroy(): void {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  public get backgroundBoosts(): FormArray {
    return this.backgroundForm.get('boosts') as FormArray;
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
              this.resetData();

              this.chosenBackground = data;
              this.background.emit(this.chosenBackground);
              this.getBackgroundFeats(this.chosenBackground.feats ?? []);
              this.initBackgroundBoostsForm(this.chosenBackground.boosts);
            },
          });
        },
      });
  }

  private resetData(): void {
    this.chosenBackground = undefined;
    this.background.emit(undefined);

    this.initBackgroundBoostsForm([]);
    this.boosts.emit(undefined);
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

    this.backgroundBoosts.valueChanges
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: boosts => {
          if (this.backgroundBoosts.valid) {
            this.boosts.emit(
              this.backgroundBoosts.value.map(
                (item: { boost: Abilities }) => item.boost
              )
            );
          } else {
            this.boosts.emit(undefined);
          }
        },
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
}
