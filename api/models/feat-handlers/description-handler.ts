import { Character, FeatEffect, SeedCharacterData } from 'rpg-app-shared-package'
import { FeatHandler } from '../feat-handler'

export class DescriptionHandler extends FeatHandler {
  constructor(effect: FeatEffect) {
    super(effect)
  }

  public async handleFeat(character: Character, seedData: SeedCharacterData): Promise<void> {
    // TODO: add descritpion feat handler
  }
}
