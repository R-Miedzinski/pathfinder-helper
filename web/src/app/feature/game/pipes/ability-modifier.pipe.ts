import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'abilityModifier',
})
export class AbilityModifierPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): string {
    return `${Number(value) >= 10 ? '+' : ''}${Math.floor(
      (Number(value) - 10) / 2
    )}`;
  }
}
