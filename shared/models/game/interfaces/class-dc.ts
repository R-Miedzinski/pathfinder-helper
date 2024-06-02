import { Abilities } from "../enums/abilities";
import { Proficiency } from "../enums/proficiency";

export interface ClassDC {
  ability: Abilities;
  savingThrow?: {
    level: Proficiency;
    value: number;
  };
  attack?: {
    level: Proficiency;
    value: number;
  };
}
