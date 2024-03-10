import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormArray } from '@angular/forms';
import { Abilities } from 'rpg-app-shared-package/dist/public-api';

@Pipe({
  name: 'excludeForFreeBoost',
})
export class ExcludeForFreeBoostPipe implements PipeTransform {
  transform(boostsList: AbstractControl[], id: number): Abilities[] {
    const valuesToExclude = boostsList
      .map(control => control.value)
      .filter((_, index) => id !== index);

    console.log(valuesToExclude);

    return valuesToExclude;
  }
}
