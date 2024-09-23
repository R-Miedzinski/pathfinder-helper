import { Abilities } from "../enums/abilities";
import { Proficiency } from "../enums/proficiency";
import { SavingThrowName } from "../enums/saving-throw-names";

export interface SavingThrow {
  name: SavingThrowName;
  ability: Abilities;
  proficiency: Proficiency;
  value: number;
}

export function newSavingThrows(): SavingThrow[] {
  return [
    {
      name: SavingThrowName.will,
      ability: Abilities.wis,
      proficiency: Proficiency.U,
      value: 0,
    },
    {
      name: SavingThrowName.fortitude,
      ability: Abilities.con,
      proficiency: Proficiency.U,
      value: 0,
    },
    {
      name: SavingThrowName.reflex,
      ability: Abilities.dex,
      proficiency: Proficiency.U,
      value: 0,
    },
  ];
}
