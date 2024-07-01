import { CharacterAction } from 'rpg-app-shared-package/dist/public-api'
import { JsonDataLoader } from './json-data-loader'

export class ActionsLoader extends JsonDataLoader<CharacterAction> {
  constructor() {
    super()
    this.dirName = this.dirName + 'actions/'
  }

  public getActions(ids: string[]): Promise<CharacterAction[]> {
    return this.loadDataFromFile().then((data) => {
      const toGet = ids
      return toGet.map((id) => data.filter((entry) => entry.id === id)).flat()
    })
  }

  public getBasicActionsIds(): Promise<string[]> {
    return this.loadDataFromFile().then((data) => data.map((entry) => entry.id).filter((id) => id.includes('base-')))
  }
}
