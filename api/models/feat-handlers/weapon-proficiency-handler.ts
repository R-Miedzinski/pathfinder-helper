import {
  Character,
  CharacterEffect,
  GrantWeaponProficiencyEffect,
  SeedCharacterData,
  createProfToValMap,
} from 'rpg-app-shared-package'
import { EffectHandler } from '../feat-handler'

export class WeaponProficiencyHandler extends EffectHandler {
  constructor(effect: CharacterEffect) {
    super(effect)
  }

  public async handleEffect(character: Character, seedData: SeedCharacterData): Promise<void> {
    const profToValMap = createProfToValMap(0)
    const payload = (<GrantWeaponProficiencyEffect>this._effect).payload

    const existingEntry = seedData.attacks.find((weapon) => weapon.type === payload.weapon)
    if (existingEntry) {
      if (profToValMap.get(existingEntry.level)! < profToValMap.get(payload.level)!) {
        existingEntry.level = payload.level
      }
    } else {
      seedData.attacks.push({
        type: payload.weapon,
        level: payload.level,
      })
    }
  }
}
