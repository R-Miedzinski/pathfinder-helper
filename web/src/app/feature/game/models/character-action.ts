import { CharacterActionType } from './enums/character-action-type';

export interface CharacterAction {
  id: string;
  name: string;
  description: string;
  type: CharacterActionType;
  cost?: number;
  traits?: string[];
  trigger?: string;
  requirements?: string;
}
