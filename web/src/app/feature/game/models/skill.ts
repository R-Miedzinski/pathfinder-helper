import { Abilities } from './enums/abilities';
import { Proficiency } from './enums/proficiency';
import { Skills } from './enums/skills';

export interface Skill {
  name: Skills;
  level: Proficiency;
  value: number;
  ability: Abilities;
  specialty?: string;
}
