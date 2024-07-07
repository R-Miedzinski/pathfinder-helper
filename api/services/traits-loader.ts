import { Trait } from 'rpg-app-shared-package'
import { JsonDataLoader } from './json-data-loader'

export class TraitsLoader extends JsonDataLoader<Trait> {
  constructor() {
    super()
    this.dirName = this.dirName + 'traits/'
  }

  public read(id: string): Trait {
    try {
      return super.read(id)
    } catch (err) {
      return {
        id,
        name: id,
        description: `Trait with id ${id} not found`,
      }
    }
  }

  public getTrait(id: string): Promise<Trait> {
    return this.loadDataFromFile().then(
      (data) =>
        data.find((trait) => trait.id === id.toLocaleLowerCase()) ?? {
          id,
          name: id,
          description: `Trait with id ${id} not found`,
        }
    )
  }
}
