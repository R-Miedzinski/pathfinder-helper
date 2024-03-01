import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Abilities } from '../../models/enums/abilities';
import keepOrder from '../../helpers/keepOrder';
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-boost-choice',
  templateUrl: './boost-choice.component.html',
  styleUrls: ['./boost-choice.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: BoostChoiceComponent,
    },
  ],
})
export class BoostChoiceComponent
  implements OnInit, OnDestroy, ControlValueAccessor
{
  @Input({ required: false }) exclude: Abilities[] = [];
  @Input({ required: false }) enableOnly: Abilities[] = [];
  protected abilities = Abilities;
  protected componentId: number = 0;
  protected disabledAbilities: Map<Abilities, boolean> = new Map();
  protected chosenAbility!: FormGroup;

  protected disabled: boolean = false;
  private touched: boolean = false;
  private onTouched = () => {};
  private onChange = (ability: Abilities) => {};

  protected readonly keepOrderLocal = keepOrder;
  private readonly allAbilities = Object.values(Abilities);
  private static id: number = 0;
  private readonly ngDestroyed$: Subject<void> = new Subject();

  constructor(private fb: FormBuilder) {}

  public ngOnInit(): void {
    this.componentId = ++BoostChoiceComponent.id;
    this.allAbilities.forEach(ability => {
      this.disabledAbilities.set(ability, false);
    });

    this.exclude.forEach(ability => {
      this.disabledAbilities.set(ability, true);
    });

    if (this.enableOnly.length > 0) {
      this.allAbilities.forEach(ability => {
        this.disabledAbilities.set(ability, true);
      });

      this.enableOnly.forEach(ability => {
        this.disabledAbilities.set(ability, false);
      });
    }

    this.chosenAbility = this.fb.group({
      ability: [undefined, Validators.required],
    });

    this.chosenAbility.controls['ability'].valueChanges
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe({
        next: ability => {
          if (!this.disabled) {
            this.onChange(ability);
          }
        },
      });
  }

  public ngOnDestroy(): void {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  public writeValue(obj: any): void {
    this.chosenAbility.controls['ability'].setValue(obj);
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.chosenAbility.disable() : this.chosenAbility.enable();
  }

  public markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }
}
