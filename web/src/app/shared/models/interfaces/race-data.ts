import { Race } from '../enums/race';
import { AbilityBoost } from './ability-boost';

export interface RaceData {
  name: Race;
  description: string;
  boosts: AbilityBoost[];
  flaws: AbilityBoost[];
}
