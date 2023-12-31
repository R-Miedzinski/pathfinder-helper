import { ItemType } from './enums/item-type';

export interface Item {
  name: string;
  itemType: ItemType;
  level: number;
  equippable: boolean;
  traits?: string[];
  price?: number;
  ammunition?: string[];
  usage?: string;
  bulk?: number;
  activate?: number;
  onset?: any;
  description: string;
  type?: string;
  craftRequirenments?: string;
}
