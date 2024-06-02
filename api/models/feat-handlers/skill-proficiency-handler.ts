import {
  Abilities,
  Character,
  FeatEffect,
  GrantSkillProficiencyEffect,
  Proficiency,
  SeedCharacterData,
  Skills,
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

    const existingEntry = seedData.skills.find(
      (skill) => skill.name === payload.skill && skill?.specialty === payload?.specialty
    )
    if (existingEntry) {
      if (profToValMap.get(existingEntry.level)! < profToValMap.get(payload.level)!) {
        existingEntry.level = payload.level
      }
    } else {
      const newSkillProficiency: {
        name: Skills
        level: Proficiency
        ability: Abilities
        specialty?: string
      } = {
        name: payload.skill,
        level: payload.level,
        ability: skillToAbilityMap[payload.skill],
      }

      if (payload?.specialty) {
        newSkillProficiency.specialty = payload.specialty
      }

      seedData.skills.push(newSkillProficiency)
    }
  }
}
