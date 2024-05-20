import { Character, FeatEffect, GrantActionEffect, SeedCharacterData } from 'rpg-app-shared-package'
import { FeatHandler } from '../feat-handler'

export class ActionHandler extends FeatHandler {
  constructor(effect: FeatEffect) {
    super(effect)
  }

  public async handleFeat(character: Character, seedData: SeedCharacterData): Promise<void> {
    const payload = (<GrantActionEffect>this._effect).payload

    seedData.actions.push(payload.actionId)
  }
}
