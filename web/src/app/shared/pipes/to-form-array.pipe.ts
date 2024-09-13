import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormArray } from '@angular/forms';

@Pipe({
  name: 'toFormArray'
})
export class ToFormArrayPipe implements PipeTransform {
  transform(value: AbstractControl): FormArray {
    return value as FormArray;
  }
}

