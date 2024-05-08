import { cloneDeep } from 'lodash'
import { Abilities, Character, Proficiency, SeedCharacterData, Skill, newCharacter } from 'rpg-app-shared-package'
import { raceData } from '../storage/raceData'
import { classData } from '../storage/classData'

export class CharacterFactory {
  private character: Character
  private profToValMap: Map<Proficiency, number> = new Map()

  constructor(characterData: SeedCharacterData) {
    this.character = newCharacter()

    this.assignConstantValues(characterData)
    this.applyAbilityBoosts(characterData)
    this.applyFeats()
    this.applyEquipment(characterData)
    this.calculateAbilityBonuses()
    this.calculateSkillProficiencies(characterData)
    this.calculateSavingThrows(characterData)
    this.calculateSpeed()
    this.calculateHealth(characterData)
    this.calculateOtherStats()
  }

  public createNewCharacter(): Character {
    return this.character
  }

  private assignConstantValues(data: SeedCharacterData): void {
    this.character.id = data.id
    this.character.characterName = data.name
    this.character.class = data.class

    const getId = (feat: { id: string; payload: unknown }) => feat.id
    this.character.feats = ([] as string[])
      .concat(data.ancestryFeats.map(getId))
      .concat(data.classFeats.map(getId))
      .concat(data.skillFeats.map(getId))
      .concat(data.bonusFeats.map(getId))
      .concat(data.generalFeats.map(getId))

    this.character.race = data.race
    this.character.level = data.level
    this.character.spells = data.spells
    this.character.inventory = data.inventory
    this.character.equippedItems = data.equippedItems
    this.character.investedItems = data.investedItems
    this.character.actions = data.actions
    this.character.backstory = data.backstory

    this.profToValMap = new Map([
      [Proficiency.U, 0],
      [Proficiency.T, 2 + this.character.level],
      [Proficiency.E, 4 + this.character.level],
      [Proficiency.M, 6 + this.character.level],
      [Proficiency.L, 8 + this.character.level],
    ])
  }

  private applyAbilityBoosts(data: SeedCharacterData): void {
    data.boosts.forEach((ability) => this.applyBoost(ability))
    data.flaws.forEach((flaw) => this.applyFlaw(flaw))
  }

  private applyFeats(): void {
    this.character.feats.forEach((feat) => console.log(`handle ${feat}`))
  }

  private applyEquipment(data: SeedCharacterData): void {
    // TODO: Figure out inventory
    console.log(data.inventory)
  }

  private calculateAbilityBonuses(): void {
    this.character.abilities.forEach((ability) => (ability.modifier = Math.floor(ability.score / 2 - 5)))
  }

  private calculateSkillProficiencies(data: SeedCharacterData): void {
    const savedSkills = cloneDeep(data.skills)

    const basicSkills = this.character.skills
      .filter((skill) => !savedSkills.map((skill) => skill.name).some((name) => name === skill.name))
      .map((skill) => {
        skill.level = Proficiency.U
        skill.value = this.character.abilities.find((ability) => ability.name === skill.ability)?.modifier ?? 0
        return skill
      })

    const characterSkills = savedSkills.map((skill) => {
      const characterSkill: Skill = {
        id: skill.name,
        name: skill.name,
        ability: skill.ability,
        level: skill.level,
        value: 0,
      }

      characterSkill.value = this.character.abilities.find((ability) => ability.name === skill.ability)?.modifier ?? 0
      characterSkill.value += this.profToValMap.get(characterSkill.level) ?? 0

      if (skill?.specialty) {
        characterSkill.specialty = skill.specialty
      }

      return characterSkill
    })

    this.character.skills = basicSkills.concat(characterSkills)
  }

  private calculateSavingThrows(data: SeedCharacterData): void {
    data.savingThrows.forEach((st) => {
      this.character.savingThrows.find((savingThrow) => savingThrow.name === st.name)!.proficiency = st.level
    })

    this.character.savingThrows.forEach((st) => {
      st.value = this.character.abilities.find((ability) => ability.name === st.ability)?.modifier ?? 0
      st.value += this.profToValMap.get(st.proficiency) ?? 0
    })
  }

  private calculateSpeed(): void {
    this.character.speed = {
      base: raceData.find((race) => race.name === this.character.race)?.baseSpeed ?? 0,
    }
  }

  private calculateHealth(data: SeedCharacterData): void {
    this.character.hp.maximum =
      data?.hp?.maximum ??
      raceData.find((race) => race.name === this.character.race)!.baseHp +
        this.character.level *
          (classData.find((charClass) => charClass.name === this.character.class)!.baseHp +
            this.character.abilities.find((ability) => ability.name === Abilities.con)!.modifier)
    this.character.hp.current = data?.hp?.current ?? this.character.hp.maximum
    this.character.hp.temporary = data?.hp?.temporary ?? 0
  }

  private calculateOtherStats(): void {
    this.character.armorClass = this.character.abilities.find((ability) => ability.name === Abilities.dex)!.modifier
    this.character.initiativeMod = this.character.abilities.find((ability) => ability.name === Abilities.dex)!.modifier
  }

  private applyBoost(ability: Abilities): void {
    let abilityId = -1
    const currAb = this.character.abilities.find((a, id) => {
      if (a.name === ability) {
        abilityId = id
        return true
      } else {
        return false
      }
    })
    if (currAb && currAb.score < 18) {
      currAb.score += 2
    } else if (currAb) {
      currAb.score += 1
    }

    if (abilityId >= 0 && currAb) {
      this.character.abilities[abilityId] = cloneDeep(currAb)
    }
  }

  private applyFlaw(ability: Abilities): void {
    let abilityId = -1
    const currAb = this.character.abilities.find((a, id) => {
      if (a.name === ability) {
        abilityId = id
        return true
      } else {
        return false
      }
    })
    if (currAb) {
      currAb.score -= 2
    }

    if (abilityId >= 0 && currAb) {
      this.character.abilities[abilityId] = cloneDeep(currAb)
    }
  }
}
