import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  forwardRef,
} from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CustomFormControl } from '../custom-form-control/custom-form-control.component';
import {
  CharacterEffectType,
  EffectChoice,
  EffectChoiceData,
  Feat,
} from 'rpg-app-shared-package/dist/public-api';
import { FeatsService } from 'src/app/feature/game/services/feats.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-feat-choice',
  templateUrl: './feat-choice.component.html',
  styleUrls: ['./feat-choice.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => FeatChoiceComponent),
    },
  ],
})
export class FeatChoiceComponent
  extends CustomFormControl<string>
  implements OnInit, OnDestroy, OnChanges
{
  @Input() feats: string[] | null = [];
  @Input() featsInPossession: string[] | null = [];
  @Input() label: string = 'Choose';
  @Output() effectChoice: EventEmitter<EffectChoice> = new EventEmitter();

  protected readonly: boolean = false;
  protected featControl: FormControl<string> = new FormControl();
  protected chosenFeat?: Feat;
  protected choiceControl: FormControl<string> = new FormControl();
  protected featChoices?: EffectChoice[];
  protected chosenEffect?: EffectChoice;
  protected featsData?: Feat[];

  private readonly ngDestroyed$: Subject<void> = new Subject();

  constructor(private featsService: FeatsService) {
    super();
  }

  public ngOnInit(): void {
    this.handleFeatControlChanges();
    this.handleChoiceControlChanges();
    this.resetFeatControl();
    this.getFeats();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['feats']) {
      this.resetFeatControl();
      this.getFeats();
    }
  }

  public ngOnDestroy(): void {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  public override setDisabledState(isDisabled: boolean): void {
    this.readonly = isDisabled;
  }

  private resetFeatControl(): void {
    this.featControl.reset('');
    this.setDisabledState(false);

    this.chosenFeat = undefined;
  }

  private handleFeatControlChanges(): void {
    this.featControl.valueChanges.pipe(takeUntil(this.ngDestroyed$)).subscribe({
      next: id => {
        this.value = id;
        this.updateValue();

        this.resetFeatChoices();
        this.chosenFeat = this.featsData?.find(feat => feat._id === id);
        const effectChoices = (
          this.chosenFeat?.effect.find(
            effect => effect.effectType === CharacterEffectType.choice
          ) as EffectChoiceData
        )?.payload.data;
        if (effectChoices) {
          this.featChoices = effectChoices;
        }
      },
    });
  }

  private handleChoiceControlChanges(): void {
    this.choiceControl.valueChanges
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: effect => {
          this.chosenEffect = this.featChoices?.find(
            choice => choice.choiceName === effect
          );

          this.effectChoice.emit(this.chosenEffect);
        },
      });
  }

  private resetFeatChoices(): void {
    this.choiceControl.reset('');

    this.featChoices = undefined;
  }

  private getFeats(): void {
    const filteredFeats = this.feats?.filter(
      feat => !this.featsInPossession?.includes(feat)
    );

    console.log(this.feats);
    console.log(this.featsInPossession);
    console.log(filteredFeats);

    this.featsService
      .getFeats(filteredFeats ?? [])
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: feats => {
          this.featsData = feats;

          if (filteredFeats?.length === 1) {
            this.initWithChosenFeat(filteredFeats[0]);
          }
        },
      });
  }

  private initWithChosenFeat(feat: string): void {
    this.featControl.setValue(feat ?? '');
    this.setDisabledState(true);
  }
}
