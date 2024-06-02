import { Proficiency } from "../enums/proficiency";
import { WeaponGroup } from "../enums/weapon-group";

export interface WeaponProficiency {
  type: WeaponGroup;
  level: Proficiency;
}
