import { ArmorCategory } from "../enums/armor-category";
import { Proficiency } from "../enums/proficiency";

export interface ArmorProficiency {
  type: ArmorCategory;
  level: Proficiency;
}
