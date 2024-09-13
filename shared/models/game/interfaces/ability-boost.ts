import { Abilities } from "../enums/abilities";

export interface AbilityBoost {
  type: AbilityBoostType;
  abilities: Abilities[];
}

export enum AbilityBoostType {
  free = "free",
  choice = "choice",
  set = "set",
}
