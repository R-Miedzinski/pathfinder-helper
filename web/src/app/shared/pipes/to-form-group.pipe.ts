import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Pipe({
  name: 'toFormGroup',
})
export class ToFormGroupPipe implements PipeTransform {
  transform(value: AbstractControl): FormGroup {
    return value as FormGroup;
  }
}
