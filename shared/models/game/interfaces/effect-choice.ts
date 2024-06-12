import { CharacterEffect, EffectChoiceData } from "./character-effect";

export interface EffectChoice {
  featId: string;
  choiceName: string;
  description: string;
  effect: CharacterEffect[];
}

export enum EffectChoiceType {
  feats = "Feats",
  effects = "Effects",
}

export interface FeatChoiceEffect extends EffectChoiceData {
  payload: {
    choiceType: EffectChoiceType.feats;
    data: string[];
  };
}

export interface EffectChoiceEffect extends EffectChoiceData {
  payload: {
    choiceType: EffectChoiceType.effects;
    data: EffectChoice[];
  };
}
