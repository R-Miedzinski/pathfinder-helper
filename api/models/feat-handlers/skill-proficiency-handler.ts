import {
  Abilities,
  Character,
  CharacterEffect,
  GrantSkillProficiencyEffect,
  Proficiency,
  SeedCharacterData,
  Skills,
  createProfToValMap,
  skillToAbilityMap,
} from 'rpg-app-shared-package'
import { EffectHandler } from '../feat-handler'

export class SkillProficiencyHandler extends EffectHandler {
  constructor(effect: CharacterEffect) {
    super(effect)
  }

  public async handleEffect(character: Character, seedData: SeedCharacterData): Promise<void> {
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
