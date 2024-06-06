import { FeatCategory } from "../enums/feat-category";
import { FeatEffect } from "./feat-data";
import { RulePayload } from "./rule-payload";

export interface Feat {
  id: string;
  name: string;
  level: number;
  category: FeatCategory;
  traits?: string[];
  description: string;
  rules?: RulePayload[];
  effect: FeatEffect[];
  overwrites?: string;
}

export enum FeatConditions {
  proficiency = "skill-proficiency",
  ability = "ability-score",
  feat = "has-feat",
}
