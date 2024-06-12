import { Abilities } from "../enums/abilities";
import { ArmorCategory } from "../enums/armor-category";
import { CharacterEffectType } from "../enums/character-effect-type";
import { Proficiency } from "../enums/proficiency";
import { SavingThrowName } from "../enums/saving-throw-names";
import { Skills } from "../enums/skills";
import { WeaponGroup } from "../enums/weapon-group";
import { EffectChoiceType } from "./effect-choice";

export interface CharacterEffect {
  effectType: CharacterEffectType;
  level?: number;
  payload?: unknown;
}

export interface GrantActionEffect extends CharacterEffect {
  payload: {
    actionId: string | string[];
  };
}

export interface GrantFeatEffect extends CharacterEffect {
  payload: {
    featId: string | string[];
  };
}

export interface GrantSkillProficiencyEffect extends CharacterEffect {
  payload: {
    skill: Skills;
    level: Proficiency;
    specialty?: string;
  };
}

export interface GrantWeaponProficiencyEffect extends CharacterEffect {
  payload: {
    weapon: WeaponGroup;
    level: Proficiency;
  };
}

export interface GrantArmorProficiencyEffect extends CharacterEffect {
  payload: {
    armor: ArmorCategory;
    level: Proficiency;
  };
}

export interface GrantSTProficiencyEffect extends CharacterEffect {
  payload: {
    savingThrow: SavingThrowName;
    level: Proficiency;
  };
}

export interface GrantBoostEffect extends CharacterEffect {
  payload: {
    boost: Abilities;
  };
}

export interface GrantFlawEffect extends CharacterEffect {
  payload: {
    flaw: Abilities;
  };
}

export interface EffectChoiceData extends CharacterEffect {
  payload: {
    choiceType: EffectChoiceType;
    data: unknown;
  };
}
