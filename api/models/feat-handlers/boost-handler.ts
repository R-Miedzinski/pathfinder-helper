import { Character, CharacterEffect, GrantBoostEffect, SeedCharacterData } from 'rpg-app-shared-package'
import { EffectHandler } from '../feat-handler'

export class BoostHandler extends EffectHandler {
  constructor(effect: CharacterEffect) {
    super(effect)
  }

  public async handleEffect(character: Character, seedData: SeedCharacterData): Promise<void> {
    const payload = (<GrantBoostEffect>this._effect).payload

    seedData.boosts.push(payload.boost)
  }
}
