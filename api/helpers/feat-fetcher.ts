import * as fs from 'fs/promises'
import path from 'path'
import { Classes, Feat, FeatData, Race } from 'rpg-app-shared-package'

export class FeatFetcher {
  private readonly baseFeatUrl: string = path.join(__dirname, `../storage/feats/mock.json`)

  constructor() {}

  public getFeatDisplayData(id: string): Promise<Feat> {
    return this.getFeatData(id).then((data) => <Feat>data)
  }

  public getFeatData(id: string): Promise<FeatData | undefined> {
    return this.readFeatsFromFile().then((data) => data.find((item) => item.id === id))
  }

  public getRaceFeatsDisplayWithQuery(level: number, race: Race): Promise<Feat[]> {
    return this.getRaceFeatsWithQuery(level, race).then((data) => data.map((item) => <Feat>item))
  }

  public getRaceFeatsWithQuery(level: number, race: Race): Promise<FeatData[]> {
    return this.readFeatsFromFile().then((data) =>
      data.filter((item) => item.level <= level && item.traits?.includes(race))
    )
  }

  public getClassFeatsDisplayWithQuery(level: number, charClass: Classes): Promise<Feat[]> {
    return this.getClassFeatsWithQuery(level, charClass).then((data) => data.map((item) => <Feat>item))
  }

  public getClassFeatsWithQuery(level: number, charClass: Classes): Promise<FeatData[]> {
    return this.readFeatsFromFile().then((data) =>
      data.filter((item) => item.level <= level && item.traits?.includes(charClass))
    )
  }

  private readFeatsFromFile(): Promise<FeatData[]> {
    return fs.readFile(this.baseFeatUrl, 'utf8').then(JSON.parse)
  }
}
