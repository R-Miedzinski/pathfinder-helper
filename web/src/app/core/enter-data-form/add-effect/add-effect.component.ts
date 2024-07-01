import {
  AfterContentInit,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  forwardRef,
} from '@angular/core';
import { FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CharacterEffectType } from 'rpg-app-shared-package/dist/public-api';
import { Subject } from 'rxjs';
import { CustomFormControl } from 'src/app/shared/components/custom-form-control/custom-form-control.component';

@Component({
  selector: 'app-add-effect',
  templateUrl: './add-effect.component.html',
  styleUrls: ['./add-effect.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => AddEffectComponent),
    },
  ],
})
export class AddEffectComponent
  extends CustomFormControl<any>
  implements OnInit, OnDestroy, OnChanges
{
  @Input() effectType?: CharacterEffectType;

  protected payloadForm: FormGroup = new FormGroup({});
  protected readonly effectTypes = CharacterEffectType;

  private readonly ngDestroyed$: Subject<void> = new Subject();

  constructor(private fb: FormBuilder) {
    super();
  }

  public ngOnInit(): void {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['effectType']) {
      this.resetForm();
      this.initForm();
    }
  }

  public ngOnDestroy(): void {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  public override setDisabledState(isDisabled: boolean): void {}

  private initForm(): void {
    switch (this.effectType) {
      case CharacterEffectType.description:
        setTimeout(() => {
          this.value = undefined;
          this.updateValue();
        }, 100);
        return;
    }
  }

  private resetForm(): void {
    const controls = Object.keys(this.payloadForm.controls);

    controls.forEach(ctrl => this.payloadForm.removeControl(ctrl));
  }
}
