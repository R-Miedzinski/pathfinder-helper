import { FeatEffectType } from "../enums/feat-effect-type";
import { Feat } from "./feat";

export interface FeatData extends Feat {
  effectType: FeatEffectType;
  payload?: unknown;
}
