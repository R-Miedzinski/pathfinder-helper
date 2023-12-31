import { Classes } from './enums/classes';
import { Feat } from './feat';

export interface CharacterClass {
  name: Classes;
  feats: Feat[];
}
