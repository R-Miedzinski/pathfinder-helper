import { CharacterClass } from './character-class';
import { HP } from './hp';
import { Race } from './enums/race';
import { Skill } from './skill';
import { EquipmentSlots } from './classes/equipment-slots';
import { SavingThrow } from './saving-throw';
import { Ability } from './ability';

export interface Character {
  characterName: string;
  class: CharacterClass;
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
  equipment?: EquipmentSlots;
  equippedItems?: { itemId: string; count: number }[];
  investedItems?: { itemId: string; count: number }[];
}
