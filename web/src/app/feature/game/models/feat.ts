import { Character } from './character';

export interface Feat {
  name: string;
  level: number;
  traits?: string[];
  description: string;
  prerequisits?: { name: string; condition: { (char: Character): Boolean } }[];
  activate?: number;
}
