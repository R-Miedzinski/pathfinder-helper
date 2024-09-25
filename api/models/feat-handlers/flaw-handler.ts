import { Character, CharacterEffect, GrantFlawEffect, SeedCharacterData } from 'rpg-app-shared-package'
import { EffectHandler } from '../feat-handler'

export class FlawHandler extends EffectHandler {
  constructor(effect: CharacterEffect) {
    super(effect)
  }

  public async handleEffect(character: Character, seedData: SeedCharacterData): Promise<void> {
    const payload = (<GrantFlawEffect>this._effect).payload

    if (Array.isArray(payload.flaw)) {
      payload.flaw.forEach((item) => {
        seedData.flaws.push(item)
      })
    } else {
      seedData.flaws.push(payload.flaw)
    }
  }
}
