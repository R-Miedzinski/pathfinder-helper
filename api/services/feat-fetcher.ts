import { Classes, FeatCategory, FeatData, Race } from 'rpg-app-shared-package'
import { JsonDataLoader } from './json-data-loader'

export class FeatFetcher extends JsonDataLoader<FeatData> {
  constructor() {
    super()
    this.dirName = this.dirName + 'feats/'
  }

  public getFeatData(id: string): Promise<FeatData | undefined> {
    return this.loadDataFromFile().then((data) => data.find((item) => item.id === id))
  }

  public getRaceFeatsWithQuery(level: number, race: Race): Promise<FeatData[]> {
    return this.loadDataFromFile().then((data) =>
      data.filter((item) => item.level <= level && item.traits?.includes(race.toLocaleLowerCase()))
    )
  }

  public getClassFeatsWithQuery(level: number, charClass: Classes): Promise<FeatData[]> {
    return this.loadDataFromFile().then((data) =>
      data.filter(
        (item) =>
          item.level <= level &&
          item.traits?.includes(charClass.toLocaleLowerCase()) &&
          item.category === FeatCategory.class
      )
    )
  }
}
