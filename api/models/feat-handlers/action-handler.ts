import { Character, CharacterEffect, GrantActionEffect, SeedCharacterData } from 'rpg-app-shared-package'
import { EffectHandler } from '../feat-handler'

export class ActionHandler extends EffectHandler {
  constructor(effect: CharacterEffect) {
    super(effect)
  }

  public async handleEffect(character: Character, seedData: SeedCharacterData): Promise<void> {
    const payload = (<GrantActionEffect>this._effect).payload

    if (Array.isArray(payload.actionId)) {
      payload.actionId.forEach((id) => {
        character.actions.push(id)
      })
    } else {
      character.actions.push(payload.actionId)
    }
  }
}
