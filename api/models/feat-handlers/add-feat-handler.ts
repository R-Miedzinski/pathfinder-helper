import { Character, CharacterEffect, GrantFeatEffect, SeedCharacterData } from 'rpg-app-shared-package'
import { EffectHandler } from '../feat-handler'
import { FeatFetcher } from '../../services/feat-fetcher'
import { identifyEffect } from '../../helpers/identify-effects'

export class AddFeatHandler extends EffectHandler {
  constructor(
    effect: CharacterEffect,
    private featFetcher: FeatFetcher
  ) {
    super(effect)
  }

  public async handleEffect(character: Character, seedData: SeedCharacterData): Promise<void> {
    const payload = (<GrantFeatEffect>this._effect).payload

    if (Array.isArray(payload.featId)) {
      const promises = payload.featId.map((id) => {
        this.featFetcher.getFeatData(id).then((data) => {
          if (data) {
            character.feats.push(data._id)
            data.effect.forEach(
              async (effect) => await identifyEffect(effect, this.featFetcher).handleEffect(character, seedData)
            )
          }
        })
      })

      await Promise.all(promises)
    } else {
      await this.featFetcher.getFeatData(payload.featId).then((data) => {
        if (data) {
          character.feats.push(data._id)
          data.effect.forEach(
            async (effect) => await identifyEffect(effect, this.featFetcher).handleEffect(character, seedData)
          )
        }
      })
    }
  }
}
