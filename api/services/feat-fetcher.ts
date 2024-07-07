import {
  Abilities,
  CharacterEffect,
  CharacterEffectType,
  Classes,
  EffectChoiceData,
  Feat,
  FeatCategory,
  GrantActionEffect,
  GrantBoostEffect,
  GrantFeatEffect,
  GrantFlawEffect,
  Race,
} from 'rpg-app-shared-package'
import * as fs from 'fs'
import { JsonDataLoader } from './json-data-loader'

export class FeatFetcher extends JsonDataLoader<Feat> {
  private categoryDirectories: Record<FeatCategory, string> = {
    [FeatCategory.ancestry]: 'race',
    [FeatCategory.bonus]: 'bonus',
    [FeatCategory.class]: 'class',
    [FeatCategory.feature]: 'class',
    [FeatCategory.general]: 'general',
    [FeatCategory.heritage]: 'race',
    [FeatCategory.skill]: 'skill',
    [FeatCategory.special]: 'bonus',
  }

  constructor() {
    super()
    this.dirName = this.dirName + 'feats/'
  }

  public create(entry: Feat): string {
    const fileUrl = `${this.dirName}/${this.categoryDirectories[entry.category]}/${entry.id}.json`

    this.simplifyFeat(entry)

    try {
      fs.writeFileSync(fileUrl, JSON.stringify(entry), { encoding: 'utf8', flag: 'wx' })
      return `Feat added: ${entry.id}`
    } catch (err) {
      throw new Error(`Failure in creating new entry: ${entry.id} :: ${err}`)
    }
  }

  public update(id: string, entry: Feat): Feat {
    const fileUrl = `${this.dirName}/${this.categoryDirectories[entry.category]}/${id}.json`

    try {
      fs.writeFileSync(fileUrl, JSON.stringify(entry), { encoding: 'utf8', flag: 'w' })
      return entry
    } catch (err) {
      throw new Error(`Failure in updating new entry: ${id} :: ${err}`)
    }
  }

  public getFeatData(id: string): Promise<Feat | undefined> {
    return this.loadDataFromFile().then((data) => data.find((item) => item.id === id))
  }

  public getAncestryFeats(race: Race, level: number): Promise<Feat[]> {
    return this.loadDataFromFile().then((data) =>
      data.filter(
        (item) =>
          item.category === FeatCategory.ancestry &&
          +item.level <= +level &&
          item.traits?.includes(race.toLocaleLowerCase())
      )
    )
  }

  public getHeritageFeats(race: Race): Promise<Feat[]> {
    return this.loadDataFromFile().then((data) =>
      data.filter((item) => item.category === FeatCategory.heritage && item.traits?.includes(race.toLocaleLowerCase()))
    )
  }

  public getClassFeats(charClass: Classes, level: number): Promise<Feat[]> {
    return this.loadDataFromFile().then((data) =>
      data.filter(
        (item) =>
          +item.level <= +level &&
          item.traits?.includes(charClass.toLocaleLowerCase()) &&
          item.category === FeatCategory.class
      )
    )
  }

  public getClassFeatures(charClass: Classes, level: number): Promise<Feat[]> {
    return this.loadDataFromFile().then((data) =>
      data.filter(
        (item) =>
          +item.level <= +level &&
          item.traits?.includes(charClass.toLocaleLowerCase()) &&
          item.category === FeatCategory.feature
      )
    )
  }

  public getFeatsByQuery(level: number, category: FeatCategory, trait?: string): Promise<Feat[]> {
    return this.loadDataFromFile().then((data) =>
      data.filter(
        (item) =>
          +item.level <= +level &&
          item.category === category &&
          (!trait || item.traits?.includes(trait.toLocaleLowerCase()))
      )
    )
  }

  private simplifyFeat(feat: Feat): void {
    feat.effect = feat.effect.reduce((acc, effect) => {
      if (effect.effectType === CharacterEffectType.boost) {
        const id = acc.findIndex((item) => item.effectType === CharacterEffectType.boost)
        if (id !== -1) {
          const currBoosts = (<GrantBoostEffect>acc[id]).payload.boost
          const payloadBoosts = (<GrantBoostEffect>effect).payload.boost
          let mergedBoosts: Abilities | Abilities[] = [] as Abilities[]

          mergedBoosts = mergedBoosts.concat(currBoosts, payloadBoosts)
          ;(<GrantBoostEffect>acc[id]).payload = { boost: mergedBoosts }
        } else {
          acc.push(effect)
        }
      } else if (effect.effectType === CharacterEffectType.flaw) {
        const id = acc.findIndex((item) => item.effectType === CharacterEffectType.flaw)
        if (id !== -1) {
          const cuuFlaws = (<GrantFlawEffect>acc[id]).payload.flaw
          const payloadFlaws = (<GrantFlawEffect>effect).payload.flaw
          let mergedFlaws: Abilities | Abilities[] = [] as Abilities[]

          mergedFlaws = mergedFlaws.concat(cuuFlaws, payloadFlaws)
          ;(<GrantFlawEffect>acc[id]).payload = { flaw: mergedFlaws }
        } else {
          acc.push(effect)
        }
      } else if (effect.effectType === CharacterEffectType.feat) {
        const id = acc.findIndex((item) => item.effectType === CharacterEffectType.feat)
        if (id !== -1) {
          const currFeats = (<GrantFeatEffect>acc[id]).payload.featId
          const payloadFeats = (<GrantFeatEffect>effect).payload.featId
          let mergedFeats: string | string[] = [] as string[]

          mergedFeats = mergedFeats.concat(currFeats, payloadFeats)
          ;(<GrantFeatEffect>acc[id]).payload = { featId: mergedFeats }
        } else {
          acc.push(effect)
        }
      } else if (effect.effectType === CharacterEffectType.action) {
        const id = acc.findIndex((item) => item.effectType === CharacterEffectType.action)
        if (id !== -1) {
          const currActions = (<GrantActionEffect>acc[id]).payload.actionId
          const payloadActions = (<GrantActionEffect>effect).payload.actionId
          let mergedActions: string | string[] = [] as string[]

          mergedActions = mergedActions.concat(currActions, payloadActions)
          ;(<GrantActionEffect>acc[id]).payload = { actionId: mergedActions }
        } else {
          acc.push(effect)
        }
      } else if (effect.effectType === CharacterEffectType.choice) {
        const payloadData = (<EffectChoiceData>effect).payload.data

        ;(<EffectChoiceData>effect).payload.data = payloadData.map((item) => {
          item.featId = feat.id
          return item
        })
        acc.push(effect)
      } else {
        acc.push(effect)
      }

      return acc
    }, [] as CharacterEffect[])

    feat.effect.forEach((effect) => {
      if (effect.effectType === CharacterEffectType.choice) {
        ;(<EffectChoiceData>effect).payload.data.forEach((choice) => (choice.featId = feat.id))
      }
    })
  }
}
