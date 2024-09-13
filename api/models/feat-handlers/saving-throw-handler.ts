import {
  Character,
  CharacterEffect,
  GrantSTProficiencyEffect,
  SeedCharacterData,
  createProfToValMap,
} from 'rpg-app-shared-package'
import { EffectHandler } from '../feat-handler'

export class SavingThrowHandler extends EffectHandler {
  constructor(effect: CharacterEffect) {
    super(effect)
  }

  public async handleEffect(character: Character, seedData: SeedCharacterData): Promise<void> {
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
