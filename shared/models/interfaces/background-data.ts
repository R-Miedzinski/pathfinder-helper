import { Proficiency } from "../enums/proficiency";
import { Skills } from "../enums/skills";
import { AbilityBoost } from "./ability-boost";

export interface BackgroundData {
  id: string;
  name: string;
  description: string;
  boosts: AbilityBoost[];
  proficiencies?: { skill: Skills; level: Proficiency; specialty?: string }[];
  feats?: string[];
}
