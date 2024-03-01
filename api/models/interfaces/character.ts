import { HP } from './hp';
import { Skill, newSkills } from './skill';
import { SavingThrow, newSavingThrows } from './saving-throw';
import { Ability, newAbilities } from './ability';
import { Backstory, newBackstory } from './backstory';
import { Classes } from '../enums/classes';
import { Race } from '../enums/race';

export interface Character {
  id: string;
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
    id: '',
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
