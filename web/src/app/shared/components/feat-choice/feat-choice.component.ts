import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
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
      useExisting: FeatChoiceComponent,
    },
  ],
})
export class FeatChoiceComponent
  extends CustomFormControl<string>
  implements OnInit, OnDestroy, OnChanges
{
  @Input() feats: Feat[] = [];
  @Input() label: string = 'Choose';
  @Output() effectChoice: EventEmitter<EffectChoice> = new EventEmitter();

  protected featControl: FormControl<string> = new FormControl();
  protected chosenFeat?: Feat;
  protected choiceControl: FormControl<string> = new FormControl();
  protected featChoices?: EffectChoice[];
  protected chosenEffect?: EffectChoice;

  private readonly ngDestroyed$: Subject<void> = new Subject();

  public ngOnInit(): void {
    this.resetFeatControl();
    this.handleFeatControlChanges();
    this.handleChoiceControlChanges();
    if (this.feats.length === 1) {
      this.initWithChosenFeat();
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['feats']) {
      this.resetFeatControl();
      if (this.feats.length === 1) {
        this.initWithChosenFeat();
      }
    }
  }

  public ngOnDestroy(): void {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  public override setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.featControl.disable();
    } else {
      this.featControl.enable();
    }
  }

  private resetFeatControl(): void {
    this.featControl.reset('');

    this.chosenFeat = undefined;
  }

  private initWithChosenFeat(): void {
    this.featControl.setValue(this.feats[0].id);
  }

  private handleFeatControlChanges(): void {
    this.featControl.valueChanges.pipe(takeUntil(this.ngDestroyed$)).subscribe({
      next: id => {
        this.value = id;
        this.updateValue();

        this.resetFeatChoices();
        this.chosenFeat = this.feats.find(feat => feat.id === id);
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
}
