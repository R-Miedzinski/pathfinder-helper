import { Abilities } from "../enums/abilities";
import { ArmorCategory } from "../enums/armor-category";
import { FeatEffectType } from "../enums/feat-effect-type";
import { Proficiency } from "../enums/proficiency";
import { SavingThrowName } from "../enums/saving-throw-names";
import { Skills } from "../enums/skills";
import { WeaponGroup } from "../enums/weapon-group";
import { FeatChoiceType } from "./feat-choice";

export interface FeatEffect {
  effectType: FeatEffectType;
  payload?: unknown;
}

export interface GrantActionEffect extends FeatEffect {
  payload: {
    actionId: string;
  };
}

export interface GrantFeatEffect extends FeatEffect {
  payload: {
    featId: string;
  };
}

export interface GrantSkillProficiencyEffect extends FeatEffect {
  payload: {
    skill: Skills;
    level: Proficiency;
    specialty?: string;
  };
}

export interface GrantWeaponProficiencyEffect extends FeatEffect {
  payload: {
    weapon: WeaponGroup;
    level: Proficiency;
  };
}

export interface GrantArmorProficiencyEffect extends FeatEffect {
  payload: {
    armor: ArmorCategory;
    level: Proficiency;
  };
}

export interface GrantSTProficiencyEffect extends FeatEffect {
  payload: {
    savingThrow: SavingThrowName;
    level: Proficiency;
  };
}

export interface GrantBoostEffect extends FeatEffect {
  payload: {
    boost: Abilities;
  };
}

export interface GrantFlawEffect extends FeatEffect {
  payload: {
    flaw: Abilities;
  };
}

export interface FeatChoiceEffect extends FeatEffect {
  payload: {
    choiceType: FeatChoiceType;
    data: unknown;
  };
}
