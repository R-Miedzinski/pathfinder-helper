import { BackgroundData } from 'rpg-app-shared-package/dist/public-api'
import { JsonDataLoader } from './json-data-loader'

export class BackgroundDataLoader extends JsonDataLoader<BackgroundData> {
  constructor() {
    super()
    this.dirName = this.dirName + 'background-data/'
  }

  public getBackgroundDataIdArray(): Promise<{ id: string; name: string }[]> {
    return this.loadDataFromFile().then((data) => data.map((entry) => ({ id: entry.id, name: entry.name })))
  }

  public getBackroundData(id: string): Promise<BackgroundData> {
    return this.loadDataFromFile().then((data) => data.find((entry) => entry.id === id)!)
  }
}
