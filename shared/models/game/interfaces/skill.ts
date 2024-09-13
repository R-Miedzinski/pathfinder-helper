import { skillToAbilityMap } from "../../../public-api";
import { Abilities } from "../enums/abilities";
import { Proficiency } from "../enums/proficiency";
import { Skills } from "../enums/skills";

export interface Skill {
  name: Skills;
  level: Proficiency;
  value: number;
  ability: Abilities;
  specialty?: string;
}

export function newSkills(): Skill[] {
  return [
    {
      name: Skills.acrobatics,
      level: Proficiency.U,
      value: 0,
      ability: skillToAbilityMap[Skills.acrobatics],
    },
    {
      name: Skills.arcana,
      level: Proficiency.U,
      value: 0,
      ability: skillToAbilityMap[Skills.arcana],
    },
    {
      name: Skills.athletics,
      level: Proficiency.U,
      value: 0,
      ability: skillToAbilityMap[Skills.athletics],
    },
    {
      name: Skills.crafting,
      level: Proficiency.U,
      value: 0,
      ability: skillToAbilityMap[Skills.crafting],
    },
    {
      name: Skills.deception,
      level: Proficiency.U,
      value: 0,
      ability: skillToAbilityMap[Skills.deception],
    },
    {
      name: Skills.diplomacy,
      level: Proficiency.U,
      value: 0,
      ability: skillToAbilityMap[Skills.diplomacy],
    },
    {
      name: Skills.intimidation,
      level: Proficiency.U,
      value: 0,
      ability: skillToAbilityMap[Skills.intimidation],
    },
    {
      name: Skills.medicine,
      level: Proficiency.U,
      value: 0,
      ability: skillToAbilityMap[Skills.medicine],
    },
    {
      name: Skills.nature,
      level: Proficiency.U,
      value: 0,
      ability: skillToAbilityMap[Skills.nature],
    },
    {
      name: Skills.occultism,
      level: Proficiency.U,
      value: 0,
      ability: skillToAbilityMap[Skills.occultism],
    },
    {
      name: Skills.perception,
      level: Proficiency.U,
      value: 0,
      ability: skillToAbilityMap[Skills.perception],
    },
    {
      name: Skills.performance,
      level: Proficiency.U,
      value: 0,
      ability: skillToAbilityMap[Skills.performance],
    },
    {
      name: Skills.religion,
      level: Proficiency.U,
      value: 0,
      ability: skillToAbilityMap[Skills.religion],
    },
    {
      name: Skills.society,
      level: Proficiency.U,
      value: 0,
      ability: skillToAbilityMap[Skills.society],
    },
    {
      name: Skills.stealth,
      level: Proficiency.U,
      value: 0,
      ability: skillToAbilityMap[Skills.stealth],
    },
    {
      name: Skills.survival,
      level: Proficiency.U,
      value: 0,
      ability: skillToAbilityMap[Skills.survival],
    },
    {
      name: Skills.thievery,
      level: Proficiency.U,
      value: 0,
      ability: skillToAbilityMap[Skills.thievery],
    },
  ];
}
