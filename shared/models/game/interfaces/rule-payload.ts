import { Abilities } from "../enums/abilities";
import { Proficiency } from "../enums/proficiency";
import { Skills } from "../enums/skills";

export interface RulePayload {
  condition: string;
  payload?: unknown;
}

export interface RuleProficiencyPayload extends RulePayload {
  payload: {
    level: Proficiency;
    skill: Skills;
  };
}

export interface RuleAbilityPayload extends RulePayload {
  payload: {
    ability: Abilities;
    score: number;
  };
}

export interface RuleFeatPayload extends RulePayload {
  payload: {
    feats: string[];
  };
}
