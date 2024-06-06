import { FeatEffect } from "./feat-data";

export interface FeatChoice {
  featId: string;
  choiceName: string;
  effect: FeatEffect[];
}

export enum FeatChoiceType {}
