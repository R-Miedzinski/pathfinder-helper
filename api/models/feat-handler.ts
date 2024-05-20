import { Character, FeatEffect, SeedCharacterData } from 'rpg-app-shared-package/dist/public-api'

export abstract class FeatHandler {
  protected _effect: FeatEffect

  constructor(effect: FeatEffect) {
    this._effect = effect
  }

  abstract handleFeat(character: Character, seedData: SeedCharacterData): Promise<void>
}
