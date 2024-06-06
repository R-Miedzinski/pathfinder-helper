import { Classes, Feat, FeatCategory, Race } from 'rpg-app-shared-package'
import { JsonDataLoader } from './json-data-loader'

export class FeatFetcher extends JsonDataLoader<Feat> {
  constructor() {
    super()
    this.dirName = this.dirName + 'feats/'
  }

  public getFeatData(id: string): Promise<Feat | undefined> {
    return this.loadDataFromFile().then((data) => data.find((item) => item.id === id))
  }

  public getAncestryFeats(race: Race, level: number): Promise<Feat[]> {
    return this.loadDataFromFile().then((data) =>
      data.filter(
        (item) =>
          item.category === FeatCategory.ancestry &&
          +item.level === +level &&
          item.traits?.includes(race.toLocaleLowerCase())
      )
    )
  }

  public getHeritageFeats(race: Race): Promise<Feat[]> {
    return this.loadDataFromFile().then((data) =>
      data.filter((item) => item.category === FeatCategory.heritage && item.traits?.includes(race.toLocaleLowerCase()))
    )
  }

  public getClassFeats(charClass: Classes, level: number): Promise<Feat[]> {
    return this.loadDataFromFile().then((data) =>
      data.filter(
        (item) =>
          +item.level === +level &&
          item.traits?.includes(charClass.toLocaleLowerCase()) &&
          item.category === FeatCategory.class
      )
    )
  }

  public getClassFeatures(charClass: Classes, level: number): Promise<Feat[]> {
    return this.loadDataFromFile().then((data) =>
      data.filter(
        (item) =>
          +item.level === +level &&
          item.traits?.includes(charClass.toLocaleLowerCase()) &&
          item.category === FeatCategory.feature
      )
    )
  }
}
