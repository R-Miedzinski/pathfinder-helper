export interface Spell {
  id: string;
  name: string;
  type: string;
  level: number;
  traits?: string[];
  description: string;
  descriptionHeightened?: string;
  tradition: string[];
  school: string;
  castRequirenments?: string[];
  castTime?: number;
  range?: number;
  target?: number;
  area?: number;
  shape?: string;
  savingThrow?: string;
  duration?: number;
}
