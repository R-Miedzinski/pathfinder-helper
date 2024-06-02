import { Abilities } from "../enums/abilities";
import { Proficiency } from "../enums/proficiency";
import { Skills } from "../enums/skills";
import { AbilityBoost } from "./ability-boost";

export interface BackgroundData {
  id: string;
  name: string;
  description: string;
  boosts: AbilityBoost[];
  proficiencies?: {
    name: Skills;
    level: Proficiency;
    specialty?: string;
    ability: Abilities;
  }[];
  feats?: string[];
}
