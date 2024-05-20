import { Abilities } from "../enums/abilities";
import { FeatCategory } from "../enums/feat-category";
import { Proficiency } from "../enums/proficiency";
import { Skills } from "../enums/skills";

export interface Feat {
  id: string;
  name: string;
  level: number;
  category: FeatCategory;
  traits?: string[];
  description: string;
  rules?: FeatRulePayload[];
}

export enum FeatConditions {
  proficiency = "skill-proficiency",
  ability = "ability-score",
  feat = "has-feat",
}

export interface FeatRulePayload {
  condition: string;
  payload?: unknown;
}

export interface FeatRuleProficiencyPayload extends FeatRulePayload {
  payload: {
    level: Proficiency;
    skill: Skills;
  };
}

export interface FeatRuleAbilityPayload extends FeatRulePayload {
  payload: {
    ability: Abilities;
    score: number;
  };
}

export interface FeatRuleFeatPayload extends FeatRulePayload {
  payload: {
    feats: string[];
  };
}
