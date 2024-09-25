import { Abilities } from "../enums/abilities";

export interface Ability {
  name: Abilities;
  score: number;
  modifier: number;
}

export function newAbilities(): Ability[] {
  return [
    {
      name: Abilities.str,
      score: 10,
      modifier: 0,
    },
    {
      name: Abilities.dex,
      score: 10,
      modifier: 0,
    },
    {
      name: Abilities.con,
      score: 10,
      modifier: 0,
    },
    {
      name: Abilities.int,
      score: 10,
      modifier: 0,
    },
    {
      name: Abilities.wis,
      score: 10,
      modifier: 0,
    },
    {
      name: Abilities.cha,
      score: 10,
      modifier: 0,
    },
  ];
}
