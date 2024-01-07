import { Abilities } from './enums/abilities';

export interface Ability {
  id: string;
  name: Abilities;
  score: number;
  modifier: number;
}
