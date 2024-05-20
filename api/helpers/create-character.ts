import { cloneDeep } from 'lodash'
import {
  Abilities,
  Character,
  Proficiency,
  SeedCharacterData,
  Skill,
  createProfToValMap,
  newCharacter,
} from 'rpg-app-shared-package'
import { raceData } from '../storage/raceData'
import { classData } from '../storage/classData'
import { FeatFetcher } from './feat-fetcher'
import { identifyEffects } from './identify-effects'

export class CharacterFactory {
  private character: Character
  private profToValMap: Map<Proficiency, number> = new Map()
  private seedData: SeedCharacterData
  private featFetcher: FeatFetcher

  constructor(characterData: SeedCharacterData, featFetcher: FeatFetcher) {
    this.character = newCharacter()
    this.featFetcher = featFetcher
    this.seedData = characterData
  }

  public async buildNewCharacter(): Promise<void> {
    this.assignConstantValues()
    await this.applyFeats()
    this.applyAbilityBoosts()
    this.applyEquipment()
    this.calculateAbilityBonuses()
    this.calculateSkillProficiencies()
    this.calculateEquipmentProficiencies()
    this.calculateSavingThrows()
    this.calculateSpeed()
    this.calculateHealth()
    this.calculateOtherStats()
  }

  public createNewCharacter(): Character {
    return this.character
  }

  private assignConstantValues(): void {
    this.character.id = this.seedData.id
    this.character.characterName = this.seedData.name
    this.character.class = this.seedData.class

    this.character.feats = ([] as { id: string; name: string }[])
      .concat(this.seedData.ancestryFeats.map((id) => ({ id, name: 'Feat: ' + id })))
      .concat(this.seedData.classFeats.map((id) => ({ id, name: 'Feat: ' + id })))
      .concat(this.seedData.skillFeats.map((id) => ({ id, name: 'Feat: ' + id })))
      .concat(this.seedData.bonusFeats.map((id) => ({ id, name: 'Feat: ' + id })))
      .concat(this.seedData.generalFeats.map((id) => ({ id, name: 'Feat: ' + id })))

    this.character.race = this.seedData.race
    this.character.level = this.seedData.level
    this.character.spells = this.seedData.spells
    this.character.inventory = this.seedData.inventory
    this.character.equippedItems = this.seedData.equippedItems
    this.character.investedItems = this.seedData.investedItems
    this.character.actions = this.seedData.actions
    this.character.backstory = this.seedData.backstory

    this.profToValMap = createProfToValMap(this.character.level)
  }

  private applyAbilityBoosts(): void {
    this.seedData.boosts.forEach((ability) => this.applyBoost(ability))
    this.seedData.flaws.forEach((flaw) => this.applyFlaw(flaw))
  }

  private async applyFeats(): Promise<void[]> {
    const promises = this.character.feats.map((feat) => {
      return new Promise<void>((resolve, reject) => {
        this.featFetcher
          .getFeatData(feat.id)
          .then(async (data) => {
            if (data) {
              console.log(
                'handling feat: ',
                feat.id,
                data.effect.map((item) => item.effectType)
              )
              const featHandlers = identifyEffects(data, this.featFetcher)
              const handlerPromises = featHandlers.map(
                async (handler) => await handler.handleFeat(this.character, this.seedData)
              )
              await Promise.all(handlerPromises)
              resolve()
            } else {
              reject()
            }
          })
          .catch(reject)
      })
    })

    return Promise.all(promises)
  }

  private applyEquipment(): void {
    // TODO: Figure out inventory
    console.log('inventory in character facotry:', this.seedData.inventory)
  }

  private calculateAbilityBonuses(): void {
    this.character.abilities.forEach((ability) => (ability.modifier = Math.floor(ability.score / 2 - 5)))
  }

  private calculateSkillProficiencies(): void {
    const savedSkills = cloneDeep(this.seedData.skills)

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

  private calculateEquipmentProficiencies(): void {
    this.character.attacks = this.seedData.attacks
    this.character.defences = this.seedData.defences
  }

  private calculateSavingThrows(): void {
    this.seedData.savingThrows.forEach((st) => {
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

  private calculateHealth(): void {
    this.character.hp.maximum =
      this.seedData?.hp?.maximum ??
      raceData.find((race) => race.name === this.character.race)!.baseHp +
        this.character.level *
          (classData.find((charClass) => charClass.name === this.character.class)!.baseHp +
            this.character.abilities.find((ability) => ability.name === Abilities.con)!.modifier)
    this.character.hp.current = this.seedData?.hp?.current ?? this.character.hp.maximum
    this.character.hp.temporary = this.seedData?.hp?.temporary ?? 0
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
