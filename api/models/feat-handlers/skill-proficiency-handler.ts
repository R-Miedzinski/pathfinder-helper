import {
  Character,
  FeatEffect,
  GrantSkillProficiencyEffect,
  SeedCharacterData,
  createProfToValMap,
  skillToAbilityMap,
} from 'rpg-app-shared-package'
import { FeatHandler } from '../feat-handler'

export class SkillProficiencyHandler extends FeatHandler {
  constructor(effect: FeatEffect) {
    super(effect)
  }

  public async handleFeat(character: Character, seedData: SeedCharacterData): Promise<void> {
    const profToValMap = createProfToValMap(0)
    const payload = (<GrantSkillProficiencyEffect>this._effect).payload

    const existingEntry = seedData.skills.find((skill) => skill.name === payload.skill)
    if (existingEntry) {
      if (profToValMap.get(existingEntry.level)! < profToValMap.get(payload.level)!) {
        existingEntry.level = payload.level
      }
    } else {
      seedData.skills.push({
        name: payload.skill,
        level: payload.level,
        ability: skillToAbilityMap[payload.skill],
      })
    }
  }
}
