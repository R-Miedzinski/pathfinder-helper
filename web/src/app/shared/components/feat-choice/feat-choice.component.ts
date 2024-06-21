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
  EffectChoiceEffect,
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
    this.resetFeatControl();
    this.getFeats();
    this.handleFeatControlChanges();
    this.handleChoiceControlChanges();
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
    // if (isDisabled) {
    //   this.featControl.disable();
    //   } else {
    //     this.featControl.enable();
    //     }
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
        this.chosenFeat = this.featsData?.find(feat => feat.id === id);
        const effectChoices = (
          this.chosenFeat?.effect.find(
            effect => effect.effectType === CharacterEffectType.choice
          ) as EffectChoiceEffect
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
    this.featsService
      .getFeats(this.feats ?? [])
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: feats => {
          this.featsData = feats;

          if (this.feats?.length === 1) {
            this.initWithChosenFeat();
          }
        },
      });
  }

  private initWithChosenFeat(): void {
    this.featControl.setValue(this.feats ? this.feats[0] : '');
    this.setDisabledState(true);
  }
}
