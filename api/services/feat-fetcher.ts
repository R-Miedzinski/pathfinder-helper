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
import { MongoDBDataLoader } from './mongo-db-data-loader'
import { Collection, InsertOneResult } from 'mongodb'

export class FeatFetcher extends MongoDBDataLoader<Feat> {
  constructor(db: Collection) {
    super(db)
  }

  public async create(entry: Feat): Promise<InsertOneResult> {
    this.simplifyFeat(entry)
    return super.create(entry)
  }

  public getFeatData(id: string): Promise<Feat | undefined> {
    return this.read(id)
  }

  public getAncestryFeats(race: Race, level: number): Promise<Feat[]> {
    return this.readAll().then((data) =>
      data.filter(
        (item) =>
          item.category === FeatCategory.ancestry &&
          +item.level <= +level &&
          item.traits?.includes(race.toLocaleLowerCase())
      )
    )
  }

  public getHeritageFeats(race: Race): Promise<Feat[]> {
    return this.readAll().then((data) =>
      data.filter((item) => item.category === FeatCategory.heritage && item.traits?.includes(race.toLocaleLowerCase()))
    )
  }

  public getClassFeats(charClass: Classes, level: number): Promise<Feat[]> {
    return this.readAll().then((data) =>
      data.filter(
        (item) =>
          +item.level <= +level &&
          item.traits?.includes(charClass.toLocaleLowerCase()) &&
          item.category === FeatCategory.class
      )
    )
  }

  public getClassFeatures(charClass: Classes, level: number): Promise<Feat[]> {
    return this.readAll().then((data) =>
      data.filter(
        (item) =>
          +item.level <= +level &&
          item.traits?.includes(charClass.toLocaleLowerCase()) &&
          item.category === FeatCategory.feature
      )
    )
  }

  public getFeatsByQuery(level: number, category: FeatCategory, trait?: string): Promise<Feat[]> {
    return this.readAll().then((data) =>
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
          item.featId = feat._id
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
        ;(<EffectChoiceData>effect).payload.data.forEach((choice) => (choice.featId = feat._id))
      }
    })
  }
}
