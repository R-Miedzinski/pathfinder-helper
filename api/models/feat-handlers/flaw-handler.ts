import { Character, FeatEffect, GrantFlawEffect, SeedCharacterData } from 'rpg-app-shared-package'
import { FeatHandler } from '../feat-handler'

export class FlawHandler extends FeatHandler {
  constructor(effect: FeatEffect) {
    super(effect)
  }

  public async handleFeat(character: Character, seedData: SeedCharacterData): Promise<void> {
    const payload = (<GrantFlawEffect>this._effect).payload

    seedData.flaws.push(payload.flaw)
  }
}
