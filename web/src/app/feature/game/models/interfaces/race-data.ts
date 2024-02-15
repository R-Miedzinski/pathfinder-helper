import { Abilities } from '../enums/abilities';
import { Race } from '../enums/race';

export interface RaceData {
  name: Race;
  description: string;
  boosts: Abilities[];
  flaws: Abilities[];
}
