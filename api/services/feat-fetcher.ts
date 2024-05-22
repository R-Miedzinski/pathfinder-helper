import * as fs from 'fs/promises'
import path from 'path'
import { Classes, FeatData, Race } from 'rpg-app-shared-package'
import { getFiles } from '../helpers/get-files'

export class FeatFetcher {
  private areFeatsLoaded = false
  private feats: FeatData[] = []
  private readonly dirName: string = path.join(__dirname, '../storage/feats/')

  public getFeatData(id: string): Promise<FeatData | undefined> {
    return this.readFeatsFromFile().then((data) => data.find((item) => item.id === id))
  }

  public getRaceFeatsWithQuery(level: number, race: Race): Promise<FeatData[]> {
    return this.readFeatsFromFile().then((data) =>
      data.filter((item) => item.level <= level && item.traits?.includes(race.toLocaleLowerCase()))
    )
  }

  public getClassFeatsWithQuery(level: number, charClass: Classes): Promise<FeatData[]> {
    return this.readFeatsFromFile().then((data) =>
      data.filter((item) => item.level <= level && item.traits?.includes(charClass.toLocaleLowerCase()))
    )
  }

  private async readFeatsFromFile(): Promise<FeatData[]> {
    if (this.areFeatsLoaded) {
      console.log('returning feats from cache')
      return new Promise((resolve) => {
        resolve(this.feats)
      })
    }

    const featsFiles: string[] = await getFiles(this.dirName)

    const promises = featsFiles.map((file) => fs.readFile(file, 'utf8').then((data) => JSON.parse(data)))
    return new Promise((resolve) => {
      Promise.all(promises).then((data) => {
        this.feats = data.flat()
        this.areFeatsLoaded = true
        resolve(data.flat())
      })
    })
  }
}
