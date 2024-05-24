import { Race, RaceData } from 'rpg-app-shared-package/dist/public-api'
import { JsonDataLoader } from './json-data-loader'

export class RaceDataLoader extends JsonDataLoader<RaceData> {
  constructor() {
    super()
    this.dirName = this.dirName + 'race-data/'
  }

  public getRaceDataList(): Promise<RaceData[]> {
    return this.loadDataFromFile()
  }

  public getRaceData(name: string): Promise<RaceData> {
    return this.loadDataFromFile().then((data) => {
      if (!(Object.values(Race) as string[]).includes(name)) {
        throw Error('Race not found')
      }
      return data.find((entry) => entry.name === name)!
    })
  }
}
