import { Dice } from "../classes/dice";
import { DamageType } from "../enums/damage-type";
import { WeaponGroup } from "../enums/weapon-group";
import { Item } from "./item";

export interface Weapon extends Item {
  damage: Dice;
  damageType: DamageType;
  hands: number;
  group: WeaponGroup;
  range?: number;
  reload?: number;
}
