import { extend } from 'lodash';
import { CharacterClass } from './character-class';
import { HP } from './hp';
import { Item } from './item';
import { Race } from './enums/race';
import { Skill } from './skill';
import { Spell } from './spell';
import { EquipmentSlots } from './classes/equipment-slots';

export interface Character {
  characterName: string;
  class: CharacterClass;
  race: Race;
  level: number;
  abilities: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
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
  savingThrows: {
    fortitude: number;
    reflex: number;
    will: number;
  };
  spellResistance?: number;
  baseAttackBonus?: number;
  cmb?: number;
  cmd?: number;
  skills: Skill[];
  inventory: Item[];
  spells?: Spell[];
  equipment?: EquipmentSlots;
  equippedItems?: { item: string; quantity: number }[];
  investedItems?: { item: string; quantity: number }[];
}
