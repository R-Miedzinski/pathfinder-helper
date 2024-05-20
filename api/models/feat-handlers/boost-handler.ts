import { Character, FeatEffect, GrantBoostEffect, SeedCharacterData } from 'rpg-app-shared-package'
import { FeatHandler } from '../feat-handler'

export class BoostHandler extends FeatHandler {
  constructor(effect: FeatEffect) {
    super(effect)
  }

  public async handleFeat(character: Character, seedData: SeedCharacterData): Promise<void> {
    const payload = (<GrantBoostEffect>this._effect).payload

    seedData.boosts.push(payload.boost)
  }
}
