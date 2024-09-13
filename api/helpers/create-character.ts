import { cloneDeep } from 'lodash'
import {
  Abilities,
  Character,
  ClassDC,
  CharacterEffect,
  InitClassData,
  Proficiency,
  RaceData,
  SeedCharacterData,
  Skill,
  createProfToValMap,
  newCharacter,
} from 'rpg-app-shared-package'
import { FeatFetcher } from '../services/feat-fetcher'
import { identifyEffect } from './identify-effects'
import { ClassDataLoader } from '../services/class-data-loader'
import { RaceDataLoader } from '../services/race-data-loader'
import { ActionsLoader } from '../services/actions-loader'
import { BackgroundDataLoader } from '../services/background-data-loader'

export class CharacterFactory {
  private character: Character
  private profToValMap: Map<Proficiency, number> = new Map()
  private raceData?: RaceData
  private classData?: InitClassData

  constructor(
    private seedData: SeedCharacterData,
    private classDataLoader: ClassDataLoader,
    private raceDataLoader: RaceDataLoader,
    private featFetcher: FeatFetcher,
    private actionsLoader: ActionsLoader,
    private backgroundDataLoader: BackgroundDataLoader
  ) {
    this.character = newCharacter()
  }

  public async buildNewCharacter(): Promise<void> {
    await this.assignConstantValues()

    this.raceData = await this.raceDataLoader.getRaceData(this.character.race)
    this.classData = await this.classDataLoader.getInitClassData(this.character.class)

    await this.applyEffects()
    this.applyAbilityBoosts()
    this.applyEquipment()
    await this.fetchActions()
    this.calculateAbilityBonuses()
    this.calculateSkillProficiencies()
    this.calculateEquipmentProficiencies()
    this.calculateSavingThrows()
    this.calculateClassDC()
    this.calculateSpeed()
    this.calculateHealth()
    this.calculateOtherStats()
  }

  public createNewCharacter(): Character {
    return this.character
  }

  private async assignConstantValues(): Promise<void> {
    this.character.id = this.seedData.id
    this.character.characterName = this.seedData.name
    this.character.class = this.seedData.class
    this.character.background = await this.backgroundDataLoader.read(this.seedData.background).then((data) => data.name)

    this.character.feats = this.seedData.feats.filter(Boolean)
    this.character.featChoices = this.seedData.featChoices

    this.character.race = this.seedData.race
    this.character.level = this.seedData.level
    this.character.spells = this.seedData.spells
    this.character.inventory = this.seedData.inventory
    this.character.equippedItems = this.seedData.equippedItems
    this.character.investedItems = this.seedData.investedItems
    if (this.seedData.actions.length) {
      this.character.actions.push(...this.seedData.actions)
    }
    this.character.backstory = this.seedData.backstory

    this.profToValMap = createProfToValMap(this.character.level)
  }

  private applyAbilityBoosts(): void {
    this.seedData.boosts.forEach((ability) => this.applyBoost(ability))
    this.seedData.flaws.forEach((flaw) => this.applyFlaw(flaw))
  }

  private async applyEffects(): Promise<void> {
    const featToChoice = new Map<string, CharacterEffect[]>(
      this.character.featChoices.map((choice) => [choice.featId, choice.effect])
    )

    const featEffects = await this.character.feats
      .map(async (feat) => {
        return await this.featFetcher.getFeatData(feat).then(async (data) => {
          if (data) {
            const choiceEffects = featToChoice.get(data.id)
            if (choiceEffects?.length) {
              return data.effect.concat(choiceEffects)
            }
            return data.effect
          }
        })
      })
      .reduce(async (acc, curr) => {
        const currList = await curr
        const accList = await acc
        return (accList ?? []).concat(currList ?? [])
      })

    return featEffects
      ?.filter((effect) => effect?.level ?? 0 <= this.character.level)
      ?.forEach(async (effect) => {
        return await identifyEffect(effect, this.featFetcher).handleEffect(this.character, this.seedData)
      })
  }

  private applyEquipment(): void {
    // TODO: Figure out inventory
  }

  private async fetchActions(): Promise<void> {
    const baseActions = (await this.actionsLoader.getBasicActionsIds()).filter(Boolean)
    const skilledActions = (
      await this.actionsLoader.getSkilledActionsIds([
        ...new Set(this.seedData.skills.filter((skill) => skill.level !== Proficiency.U).map((skill) => skill.name)),
      ])
    ).filter(Boolean)

    this.character.actions.push(...baseActions.concat(skilledActions))
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

  private calculateClassDC(): void {
    if (this.classData) {
      const classDC: ClassDC = {
        ability: this.classData!.keyAbility,
      }

      const abilityMod = this.character.abilities.find((ability) => ability.name === classDC.ability)?.modifier ?? 0
      const savingThrow = this.character.classDC?.savingThrow?.level ?? this.classData.classDC?.savingThrow
      const attack = this.character.classDC?.attack?.level ?? this.classData.classDC?.attack

      if (savingThrow) {
        classDC.savingThrow = {
          level: savingThrow,
          value: abilityMod + (this.profToValMap.get(savingThrow) ?? 0),
        }
      }

      if (attack) {
        classDC.attack = {
          level: attack,
          value: abilityMod + (this.profToValMap.get(attack) ?? 0),
        }
      }

      this.character.classDC = classDC
    }
  }

  private calculateSpeed(): void {
    this.character.speed = {
      base: this.raceData?.baseSpeed ?? 0,
    }
  }

  private calculateHealth(): void {
    this.character.hp.maximum =
      this.seedData?.hp?.maximum ??
      (this.raceData?.baseHp ?? 0) +
        this.character.level *
          ((this.classData?.baseHp ?? 0) +
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
