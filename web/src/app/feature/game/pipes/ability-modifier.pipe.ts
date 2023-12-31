import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'abilityModifier',
})
export class AbilityModifierPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): number {
    return Math.floor((Number(value) - 10) / 2);
  }
}
