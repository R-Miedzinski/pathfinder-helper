import { HP } from './hp';
import { Race } from '../enums/race';
import { Skill, newSkills } from './skill';
import { SavingThrow, newSavingThrows } from './saving-throw';
import { Ability, newAbilities } from './ability';
import { Classes } from '../enums/classes';
import { Backstory, newBackstory } from './backstory';

export interface Character {
  characterName: string;
  class: Classes;
  feats: string[];
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
  actions?: string[];
  backstory: Backstory;
}

export function newCharacter(): Character {
  const newCharacter = {
    characterName: '',
    class: Classes.fighter,
    feats: [],
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
  };

  return newCharacter;
}
