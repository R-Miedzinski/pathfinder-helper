import { Abilities, Skills } from "../public-api";

export const skillToAbilityMap: Record<Skills, Abilities> = {
  [Skills.acrobatics]: Abilities.dex,
  [Skills.arcana]: Abilities.int,
  [Skills.athletics]: Abilities.str,
  [Skills.crafting]: Abilities.int,
  [Skills.deception]: Abilities.cha,
  [Skills.diplomacy]: Abilities.cha,
  [Skills.intimidation]: Abilities.cha,
  [Skills.lore]: Abilities.int,
  [Skills.medicine]: Abilities.wis,
  [Skills.nature]: Abilities.wis,
  [Skills.occultism]: Abilities.int,
  [Skills.performance]: Abilities.cha,
  [Skills.perception]: Abilities.wis,
  [Skills.religion]: Abilities.wis,
  [Skills.society]: Abilities.int,
  [Skills.stealth]: Abilities.dex,
  [Skills.survival]: Abilities.wis,
  [Skills.thievery]: Abilities.dex,
};
