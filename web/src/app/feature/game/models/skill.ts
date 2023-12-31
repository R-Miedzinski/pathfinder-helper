import { Abilities } from './classes/abilities';
import { Proficiency } from './enums/proficiency';
import { Skills } from './enums/skills';

export interface Skill {
  name: Skills;
  level: Proficiency;
  value: number;
  ability: keyof Abilities;
  specialty?: string;
}
