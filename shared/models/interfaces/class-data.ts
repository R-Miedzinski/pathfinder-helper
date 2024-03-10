import { Abilities } from "../enums/abilities";
import { ArmorCategory } from "../enums/armor-category";
import { Classes } from "../enums/classes";
import { Proficiency } from "../enums/proficiency";
import { SavingThrowName } from "../enums/saving-throw-names";
import { Skills } from "../enums/skills";
import { WeaponGroup } from "../enums/weapon-group";
import { AbilityBoost } from "./ability-boost";

export interface ClassData {
  id: string;
  name: Classes;
  boosts: AbilityBoost[];
  keyAbility: Abilities;
  description: string;
  baseHp: number;
  savingThrows: { name: SavingThrowName; level: Proficiency }[];
  proficiencies: { skill: Skills; level: Proficiency; specialty?: string }[];
  weaponProficiencies: {
    type: WeaponGroup;
    level: Proficiency;
  }[];
  armorProficiencies: {
    type: ArmorCategory;
    level: Proficiency;
  }[];
}
