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
    console.log('handle add feat')

    await this.featFetcher.getFeatData((<GrantFeatEffect>this._effect).payload.featId).then((data) => {
      if (data) {
        character.feats.push(data.id)
        data.effect.forEach(
          async (effect) => await identifyEffect(effect, this.featFetcher).handleEffect(character, seedData)
        )
        // identifyEffects(data.effect, this.featFetcher).forEach(
        //   async (effect) => await effect.handleFeat(character, seedData)
        // )
      }
    })
  }
}
