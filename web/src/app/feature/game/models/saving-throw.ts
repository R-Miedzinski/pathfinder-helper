import { Abilities } from './enums/abilities';
import { Proficiency } from './enums/proficiency';
import { SavingThrowName } from './enums/saving-throw-names';

export interface SavingThrow {
  id: string;
  name: SavingThrowName;
  ability: Abilities;
  proficiency: Proficiency;
  value: number;
}
