import { Abilities } from '../enums/abilities';
import { Proficiency } from '../enums/proficiency';
import { Skills } from '../enums/skills';

export interface Skill {
  id: string;
  name: Skills;
  level: Proficiency;
  value: number;
  ability: Abilities;
  specialty?: string;
}

export function newSkills(): Skill[] {
  return [
    {
      id: Skills.acrobatics,
      name: Skills.acrobatics,
      level: Proficiency.U,
      value: 0,
      ability: Abilities.dex,
    },
    {
      id: Skills.arcana,
      name: Skills.arcana,
      level: Proficiency.U,
      value: 0,
      ability: Abilities.int,
    },
    {
      id: Skills.athletics,
      name: Skills.athletics,
      level: Proficiency.U,
      value: 0,
      ability: Abilities.str,
    },
    {
      id: Skills.crafting,
      name: Skills.crafting,
      level: Proficiency.U,
      value: 0,
      ability: Abilities.int,
    },
    {
      id: Skills.deception,
      name: Skills.deception,
      level: Proficiency.U,
      value: 0,
      ability: Abilities.cha,
    },
    {
      id: Skills.diplomacy,
      name: Skills.diplomacy,
      level: Proficiency.U,
      value: 0,
      ability: Abilities.cha,
    },
    {
      id: Skills.intimidation,
      name: Skills.intimidation,
      level: Proficiency.U,
      value: 0,
      ability: Abilities.cha,
    },
    {
      id: Skills.medicine,
      name: Skills.medicine,
      level: Proficiency.U,
      value: 0,
      ability: Abilities.wis,
    },
    {
      id: Skills.nature,
      name: Skills.nature,
      level: Proficiency.U,
      value: 0,
      ability: Abilities.wis,
    },
    {
      id: Skills.occultism,
      name: Skills.occultism,
      level: Proficiency.U,
      value: 0,
      ability: Abilities.int,
    },
    {
      id: Skills.performance,
      name: Skills.performance,
      level: Proficiency.U,
      value: 0,
      ability: Abilities.cha,
    },
    {
      id: Skills.religion,
      name: Skills.religion,
      level: Proficiency.U,
      value: 0,
      ability: Abilities.wis,
    },
    {
      id: Skills.society,
      name: Skills.society,
      level: Proficiency.U,
      value: 0,
      ability: Abilities.int,
    },
    {
      id: Skills.stealth,
      name: Skills.stealth,
      level: Proficiency.U,
      value: 0,
      ability: Abilities.dex,
    },
    {
      id: Skills.survival,
      name: Skills.survival,
      level: Proficiency.U,
      value: 0,
      ability: Abilities.wis,
    },
    {
      id: Skills.thievery,
      name: Skills.thievery,
      level: Proficiency.U,
      value: 0,
      ability: Abilities.dex,
    },
  ];
}
