import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { CustomFormControl } from '../custom-form-control/custom-form-control.component';

@Component({
  selector: 'app-languages-input',
  templateUrl: './languages-input.component.html',
  styleUrls: ['./languages-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => LanguagesInputComponent),
    },
  ],
})
export class LanguagesInputComponent extends CustomFormControl<string[]> {
  @Input() toAdd: number = 0;

  protected isInputDisabled: boolean = false;
  protected readonly separatorKeysCodes = [ENTER, COMMA];

  public setDisabledState(isDisabled: boolean): void {
    this.isInputDisabled = isDisabled;
  }

  protected add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.value.push(value);
      this.updateValue();
      this.toAdd -= 1;
    }

    event.chipInput!.clear();
  }

  protected remove(lang: string): void {
    const index = this.value.indexOf(lang);

    if (index >= 0) {
      this.value.splice(index, 1);
      this.updateValue();
      this.toAdd += 1;
    }
  }

  protected edit(lang: string, event: MatChipEditedEvent) {
    const value = event.value.trim();

    if (!value) {
      this.remove(lang);
      return;
    }

    const index = this.value.indexOf(lang);
    if (index >= 0) {
      this.value[index] = value;
      this.updateValue();
    }
  }
}
