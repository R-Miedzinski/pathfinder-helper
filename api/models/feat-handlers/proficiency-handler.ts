import { Character, Proficiency, Skill } from 'rpg-app-shared-package/dist/public-api'
import { FeatHandler } from '../feat-handler'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const proficiencyToOrder = {
  [Proficiency.U]: 0,
  [Proficiency.T]: 1,
  [Proficiency.E]: 2,
  [Proficiency.M]: 3,
  [Proficiency.L]: 4,
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const orderToProficiency: { [key: number]: Proficiency } = {
  0: Proficiency.U,
  1: Proficiency.T,
  2: Proficiency.E,
  3: Proficiency.M,
  4: Proficiency.L,
}

export class ProficiencyHandler extends FeatHandler {
  public handleFeat(character: Character): void {
    switch (this._payload?.proficiencyType) {
      case ProficiencyType.armor:
        this.armorProficiencyHandler(character)
        break
      case ProficiencyType.weapon:
        this.weaponProficiencyHandler(character)
        break
      case ProficiencyType.skill:
        this.skillProficiencyHandler(character)
        break
      default:
        this.generalProficiencyHandler(character)
    }
  }

  private armorProficiencyHandler(character: Character): void {
    // TODO: handle armor proficiency
  }

  private weaponProficiencyHandler(character: Character): void {
    // TODO: handle weapon proficiency
  }

  private skillProficiencyHandler(character: Character): void {
    const skill = character.skills.find((skill) => skill.id === this._payload?.skillId)

    if (skill) {
      if (this._payload?.isSet) {
        skill.level = this._payload.skillLevel
      } else if (this._payload?.isImprove) {
        this.improveProficiency(skill)
      }
    }
  }

  private generalProficiencyHandler(character: Character): void {
    // TODO: handle other proficiencies
  }

  private improveProficiency(skill: Skill): void {
    if (skill.level !== Proficiency.L) {
      skill.level = orderToProficiency[proficiencyToOrder[skill.level] + 1]
    }
  }
}

enum ProficiencyType {
  armor = 'Armor',
  weapon = 'Weapon',
  skill = 'Skill',
}
