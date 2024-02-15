import { ArmorCategory } from '../enums/armor-category';
import { ArmorGroup } from '../enums/armor-group';
import { Item } from './item';

export interface Armor extends Item {
  category: ArmorCategory;
  group: ArmorGroup;
  ACbonus: number;
  DexcCap: number;
  checkPenalty: number;
  speedPenalty: number;
  minStrenght: number;
}
