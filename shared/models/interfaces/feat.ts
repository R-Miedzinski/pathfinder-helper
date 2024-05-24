import { Abilities } from "../enums/abilities";
import { FeatCategory } from "../enums/feat-category";
import { Proficiency } from "../enums/proficiency";
import { Skills } from "../enums/skills";
import { RulePayload } from "./rule-payload";

export interface Feat {
  id: string;
  name: string;
  level: number;
  category: FeatCategory;
  traits?: string[];
  description: string;
  rules?: RulePayload[];
}

export enum FeatConditions {
  proficiency = "skill-proficiency",
  ability = "ability-score",
  feat = "has-feat",
}
