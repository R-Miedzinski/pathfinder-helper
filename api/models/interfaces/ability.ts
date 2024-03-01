import { Abilities } from '../enums/abilities';

export interface Ability {
  id: string;
  name: Abilities;
  score: number;
  modifier: number;
}

export function newAbilities(): Ability[] {
  return [
    {
      id: Abilities.str,
      name: Abilities.str,
      score: 10,
      modifier: 0,
    },
    {
      id: Abilities.dex,
      name: Abilities.dex,
      score: 10,
      modifier: 0,
    },
    {
      id: Abilities.con,
      name: Abilities.con,
      score: 10,
      modifier: 0,
    },
    {
      id: Abilities.int,
      name: Abilities.int,
      score: 10,
      modifier: 0,
    },
    {
      id: Abilities.wis,
      name: Abilities.wis,
      score: 10,
      modifier: 0,
    },
    {
      id: Abilities.cha,
      name: Abilities.cha,
      score: 10,
      modifier: 0,
    },
  ];
}
