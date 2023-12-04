import { ClassFeat } from './class-feat';

export interface CharacterClass {
  name: CharacterClassName;
  feats: ClassFeat[];
}

export enum CharacterClassName {
  Alchemist = 'alchemist',
  Fighter = 'fighter',
  Barbarian = 'barbarian',
  Monk = 'monk',
  Bard = 'bard',
  Ranger = 'ranger',
  Champion = 'champion',
  Rogue = 'rogue',
  Cleric = 'cleric',
  Sorcerer = 'sorcerer',
  Druid = 'druid',
  Wizard = 'wizard',
}
