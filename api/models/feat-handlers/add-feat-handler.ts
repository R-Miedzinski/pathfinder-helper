import { Character, FeatEffect, GrantFeatEffect, SeedCharacterData } from 'rpg-app-shared-package'
import { FeatHandler } from '../feat-handler'
import { FeatFetcher } from '../../services/feat-fetcher'
import { identifyEffects } from '../../helpers/identify-effects'

export class AddFeatHandler extends FeatHandler {
  constructor(
    effect: FeatEffect,
    private featFetcher: FeatFetcher
  ) {
    super(effect)
  }

  public async handleFeat(character: Character, seedData: SeedCharacterData): Promise<void> {
    console.log('handle add feat')

    await this.featFetcher.getFeatData((<GrantFeatEffect>this._effect).payload.featId).then((data) => {
      if (data) {
        character.feats.push(data.id)
        identifyEffects(data.effect, this.featFetcher).forEach(
          async (effect) => await effect.handleFeat(character, seedData)
        )
      }
    })
  }
}
