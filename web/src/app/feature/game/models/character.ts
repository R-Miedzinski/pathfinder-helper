import { CharacterClass } from './character-class';
import { Race } from './race';
import { Skill } from './skill';

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
  hp: {
    current: number;
    maximum: number;
  };
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
}
