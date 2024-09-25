import { FeatCategory } from "../enums/feat-category";
import { CharacterEffect } from "./character-effect";
import { RulePayload } from "./rule-payload";

export interface Feat {
  _id: string;
  name: string;
  level: number;
  category: FeatCategory;
  traits?: string[];
  description: string;
  rules?: RulePayload[];
  effect: CharacterEffect[];
}

export enum FeatConditions {
  proficiency = "skill-proficiency",
  ability = "ability-score",
  feat = "has-feat",
  description = "description",
}
