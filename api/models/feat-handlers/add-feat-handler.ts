import { Character, FeatEffect, GrantFeatEffect, SeedCharacterData } from 'rpg-app-shared-package'
import { FeatHandler } from '../feat-handler'
import { FeatFetcher } from '../../helpers/feat-fetcher'
import { identifyEffects } from '../../helpers/identify-effects'

export class AddFeatHandler extends FeatHandler {
  private _featFetcher

  constructor(effect: FeatEffect, featFetcher: FeatFetcher) {
    super(effect)
    this._featFetcher = featFetcher
  }

  public async handleFeat(character: Character, seedData: SeedCharacterData): Promise<void> {
    console.log('handle add feat')

    await this._featFetcher.getFeatData((<GrantFeatEffect>this._effect).payload.featId).then((data) => {
      if (data) {
        character.feats.push(data)
        identifyEffects(data, this._featFetcher).forEach(async (effect) => await effect.handleFeat(character, seedData))
      }
    })
  }
}
