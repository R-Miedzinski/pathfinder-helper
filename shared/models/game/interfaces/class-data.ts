import { Abilities } from "../enums/abilities";
import { Classes } from "../enums/classes";
import { Proficiency } from "../enums/proficiency";
import { SavingThrowName } from "../enums/saving-throw-names";
import { Skills } from "../enums/skills";
import { AbilityBoost } from "./ability-boost";
import { ArmorProficiency } from "./armor-proficiency";
import { LevelBonus } from "./level-bonus";
import { WeaponProficiency } from "./weapon-proficiency";

export interface ClassData {
  id: string;
  name: Classes;
  initData: InitClassData;
  levelUpData: LevelUpClassData;
}

export interface InitClassData {
  boosts: AbilityBoost[];
  keyAbility: Abilities;
  description: string;
  baseHp: number;
  savingThrows: { name: SavingThrowName; level: Proficiency }[];
  proficiencies: {
    name: Skills;
    level: Proficiency;
    specialty?: string;
    ability: Abilities;
  }[];
  weaponProficiencies: WeaponProficiency[];
  armorProficiencies: ArmorProficiency[];
  additionalProficiencies: number;
  classDC?: {
    savingThrow?: Proficiency;
    attack?: Proficiency;
  };
}

export interface DisplayInitClassData extends InitClassData {
  id: string;
  name: Classes;
}

export interface LevelUpClassData {
  [key: number]: LevelBonus[];
}

export interface DisplayLevelUpClassData extends LevelUpClassData {
  id: string;
  name: Classes;
}
