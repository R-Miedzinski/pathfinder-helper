import { Abilities } from "../enums/abilities";
import { Proficiency } from "../enums/proficiency";
import { SavingThrowName } from "../enums/saving-throw-names";

export interface SavingThrow {
  id: string;
  name: SavingThrowName;
  ability: Abilities;
  proficiency: Proficiency;
  value: number;
}

export function newSavingThrows(): SavingThrow[] {
  return [
    {
      id: SavingThrowName.will,
      name: SavingThrowName.will,
      ability: Abilities.wis,
      proficiency: Proficiency.U,
      value: 0,
    },
    {
      id: SavingThrowName.fortitude,
      name: SavingThrowName.fortitude,
      ability: Abilities.con,
      proficiency: Proficiency.U,
      value: 0,
    },
    {
      id: SavingThrowName.reflex,
      name: SavingThrowName.reflex,
      ability: Abilities.dex,
      proficiency: Proficiency.U,
      value: 0,
    },
  ];
}
