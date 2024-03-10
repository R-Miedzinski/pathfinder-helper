import { CreatureSize } from "../enums/creature-size";
import { Race } from "../enums/race";
import { AbilityBoost } from "./ability-boost";

export interface RaceData {
  name: Race;
  description: string;
  boosts: AbilityBoost[];
  flaws: AbilityBoost[];
  size: CreatureSize;
  baseSpeed: number;
  languages: string[];
  traits: string[];
  baseHp: number;
  darkvision?: string;
}
