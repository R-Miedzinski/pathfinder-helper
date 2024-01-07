import { HP } from './hp';
import { Race } from './enums/race';
import { Skill } from './skill';
import { SavingThrow } from './saving-throw';
import { Ability } from './ability';
import { Classes } from './enums/classes';

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
}
