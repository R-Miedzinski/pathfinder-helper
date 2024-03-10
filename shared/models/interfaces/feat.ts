import { Character } from './character';
import { FeatCategory } from '../enums/feat-category';

export interface Feat {
  id: string;
  name: string;
  level: number;
  category: FeatCategory;
  traits?: string[];
  description: string;
  eligible?: boolean;
  prerequisits?: { condition: string; fills: boolean }[];
  activate?: number;
}
