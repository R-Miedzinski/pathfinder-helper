import { Abilities } from "../enums/abilities";
import { Classes } from "../enums/classes";
import { Proficiency } from "../enums/proficiency";
import { Race } from "../enums/race";
import { SavingThrowName } from "../enums/saving-throw-names";
import { Skills } from "../enums/skills";
import { ArmorProficiency } from "./armor-proficiency";
import { Backstory } from "./backstory";
import { WeaponProficiency } from "./weapon-proficiency";

export interface SeedCharacterData {
  id: string;
  name: string;
  class: Classes;
  ancestryFeats: string[];
  classFeats: string[];
  skillFeats: string[];
  bonusFeats: string[];
  generalFeats: string[];
  race: Race;
  level: number;
  boosts: Abilities[];
  flaws: Abilities[];
  savingThrows: { name: SavingThrowName; level: Proficiency }[];
  skills: {
    name: Skills;
    level: Proficiency;
    ability: Abilities;
    specialty?: string;
  }[];
  inventory: { itemId: string; count: number }[];
  spells: string[];
  equippedItems: { itemId: string; count: number }[];
  investedItems: { itemId: string; count: number }[];
  actions: string[];
  backstory: Backstory;
  hp?: {
    maximum?: number;
    current?: number;
    temporary?: number;
  };
  attacks: WeaponProficiency[];
  defences: ArmorProficiency[];
}
