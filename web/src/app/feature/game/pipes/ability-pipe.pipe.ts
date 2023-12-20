import { Pipe, PipeTransform } from '@angular/core';
import { Abilities } from '../models/abilities';

@Pipe({
  name: 'abilityPipe',
})
export class AbilityPipePipe implements PipeTransform {
  transform(value: unknown): string {
    return new Abilities()[<keyof Abilities>value];
  }
}
