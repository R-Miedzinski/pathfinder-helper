import {
  Character,
  FeatEffect,
  GrantSTProficiencyEffect,
  SeedCharacterData,
  createProfToValMap,
} from 'rpg-app-shared-package'
import { FeatHandler } from '../feat-handler'

export class SavingThrowHandler extends FeatHandler {
  constructor(effect: FeatEffect) {
    super(effect)
  }

  public async handleFeat(character: Character, seedData: SeedCharacterData): Promise<void> {
    const profToValMap = createProfToValMap(0)
    const payload = (<GrantSTProficiencyEffect>this._effect).payload

    const existingEntry = seedData.savingThrows.find((ST) => ST.name === payload.savingThrow)
    if (existingEntry) {
      if (profToValMap.get(existingEntry.level)! < profToValMap.get(payload.level)!) {
        existingEntry.level = payload.level
      }
    } else {
      seedData.savingThrows.push({
        name: payload.savingThrow,
        level: payload.level,
      })
    }
  }
}
