import { Character, CharacterEffect, SeedCharacterData } from 'rpg-app-shared-package/dist/public-api'

export abstract class EffectHandler {
  protected _effect: CharacterEffect

  constructor(effect: CharacterEffect) {
    this._effect = effect
  }

  abstract handleEffect(character: Character, seedData: SeedCharacterData): Promise<void>
}
