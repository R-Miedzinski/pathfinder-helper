import { FeatCategory } from "../enums/feat-category";
import { LevelBonusCategory } from "../enums/level-bonus-category";

export interface LevelBonus {
  category: LevelBonusCategory;
}

export interface AddFeatLevelBonus extends LevelBonus {
  payload: {
    featId: string;
  };
}

export interface ReplaceFeatLevelBonus extends LevelBonus {
  payload: {
    added: string;
    replaces: string;
  };
}

export interface ChooseFeatLevelBonus extends LevelBonus {
  payload: {
    category: FeatCategory;
  };
}
