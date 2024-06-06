import { HP } from "./hp";
import { Skill, newSkills } from "./skill";
import { SavingThrow, newSavingThrows } from "./saving-throw";
import { Ability, newAbilities } from "./ability";
import { Backstory, newBackstory } from "./backstory";
import { Classes } from "../enums/classes";
import { Race } from "../enums/race";
import { WeaponProficiency } from "./weapon-proficiency";
import { ArmorProficiency } from "./armor-proficiency";
import { ClassDC } from "./class-dc";
import { FeatChoice } from "./feat-choice";

export interface Character {
  id: string;
  characterName: string;
  class: Classes;
  background: string;
  feats: string[];
  featChoices: FeatChoice[];
  race: Race;
  level: number;
  abilities: Ability[];
  hp: HP;
  speed: {
    base: number;
    armored?: number;
    fly?: number;
    swim?: number;
    climb?: number;
    burrow?: number;
  };
  initiativeMod: number;
  armorClass: number;
  savingThrows: SavingThrow[];
  spellResistance?: number;
  baseAttackBonus?: number;
  cmb?: number;
  cmd?: number;
  skills: Skill[];
  inventory: { itemId: string; count: number }[];
  spells?: string[];
  equippedItems?: { itemId: string; count: number }[];
  investedItems?: { itemId: string; count: number }[];
  actions: string[];
  backstory: Backstory;
  attacks: WeaponProficiency[];
  defences: ArmorProficiency[];
  classDC?: ClassDC;
}

export function newCharacter(): Character {
  const newCharacter = {
    id: "",
    characterName: "",
    class: Classes.fighter,
    background: "",
    feats: [],
    featChoices: [],
    race: Race.human,
    level: 1,
    abilities: newAbilities(),
    hp: {
      maximum: 0,
      current: 0,
      temporary: 0,
    },
    speed: {
      base: 0,
    },
    initiativeMod: 0,
    armorClass: 0,
    savingThrows: newSavingThrows(),
    skills: newSkills(),
    inventory: [],
    backstory: newBackstory(),
    attacks: [],
    defences: [],
    actions: [],
  };

  return newCharacter;
}
