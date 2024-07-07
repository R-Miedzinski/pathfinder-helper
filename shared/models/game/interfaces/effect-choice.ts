import { CharacterEffect, EffectChoiceData } from "./character-effect";

export interface EffectChoice {
  featId: string;
  choiceName: string;
  description: string;
  effect: CharacterEffect[];
}
