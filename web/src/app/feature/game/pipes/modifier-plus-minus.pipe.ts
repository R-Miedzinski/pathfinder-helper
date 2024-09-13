import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'modifierPlusMinus',
})
export class ModifierPlusMinusPipe implements PipeTransform {
  transform(value: number): '+' | '' {
    return value >= 10 ? '+' : '';
  }
}
