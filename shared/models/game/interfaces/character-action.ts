import { ActionSource } from "../enums/action-source";
import { CharacterActionType } from "../enums/character-action-type";
import { Skills } from "../enums/skills";
import { ActionEffects } from "./action-effects";

export interface CharacterAction {
  id: string;
  name: string;
  description: string;
  type: CharacterActionType;
  source: ActionSource;
  effects?: ActionEffects;
  cost?: number;
  skill?: Skills;
  materials?: string;
  traits?: string[];
  trigger?: string;
  rules?: string;
}
