import { SeedCharacterData } from 'rpg-app-shared-package/dist/public-api'
import { JsonDataLoader } from './json-data-loader'

export class UserCharactersLoader extends JsonDataLoader<SeedCharacterData> {
  constructor(private id: string) {
    super()
    this.dirName = this.dirName + `characters/${this.id}`
  }

  public getUserCharacters(): Promise<SeedCharacterData[]> {
    // TODO: Create better solution
    return this.loadDataFromFile()
  }
}
