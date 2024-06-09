import { CharacterEffect } from "./character-effect";

export interface FeatChoice {
  featId: string;
  choiceName: string;
  description: string;
  effect: CharacterEffect[];
}

export enum FeatChoiceType {}
