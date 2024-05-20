import {
  Character,
  FeatEffect,
  GrantArmorProficiencyEffect,
  SeedCharacterData,
  createProfToValMap,
} from 'rpg-app-shared-package'
import { FeatHandler } from '../feat-handler'

export class ArmorProficiencyHandler extends FeatHandler {
  constructor(effect: FeatEffect) {
    super(effect)
  }

  public async handleFeat(character: Character, seedData: SeedCharacterData): Promise<void> {
    const profToValMap = createProfToValMap(0)
    const payload = (<GrantArmorProficiencyEffect>this._effect).payload

    const existingEntry = seedData.defences.find((armor) => armor.type === payload.armor)
    if (existingEntry) {
      if (profToValMap.get(existingEntry.level)! < profToValMap.get(payload.level)!) {
        existingEntry.level = payload.level
      }
    } else {
      seedData.defences.push({
        type: payload.armor,
        level: payload.level,
      })
    }
  }
}
