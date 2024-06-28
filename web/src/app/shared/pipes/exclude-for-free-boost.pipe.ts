import { Pipe, PipeTransform } from '@angular/core';
import { Abilities } from 'rpg-app-shared-package/dist/public-api';

@Pipe({
  name: 'excludeForFreeBoost',
})
export class ExcludeForFreeBoostPipe implements PipeTransform {
  transform(boostsList: any[], id: number): Abilities[] {
    const valuesToExclude = boostsList
      .filter((control, index) => index !== id)
      .map(control => control.boost);

    return valuesToExclude;
  }
}
