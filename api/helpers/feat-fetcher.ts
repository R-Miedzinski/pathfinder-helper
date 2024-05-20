import * as fs from 'fs/promises'
import path from 'path'
import { Classes, FeatData, Race } from 'rpg-app-shared-package'

export class FeatFetcher {
  private readonly dirName: string = path.join(__dirname, '../storage/feats/')
  private areFeatsLoaded = false
  private feats: FeatData[] = []

  constructor() {}

  public getFeatData(id: string): Promise<FeatData | undefined> {
    return this.readFeatsFromFile().then((data) => data.find((item) => item.id === id))
  }

  public getRaceFeatsWithQuery(level: number, race: Race): Promise<FeatData[]> {
    return this.readFeatsFromFile().then((data) =>
      data.filter((item) => item.level <= level && item.traits?.includes(race))
    )
  }

  public getClassFeatsWithQuery(level: number, charClass: Classes): Promise<FeatData[]> {
    return this.readFeatsFromFile().then((data) =>
      data.filter((item) => item.level <= level && item.traits?.includes(charClass))
    )
  }

  private async readFeatsFromFile(): Promise<FeatData[]> {
    if (this.areFeatsLoaded) {
      console.log('returning feats from cache')
      return new Promise((resolve) => {
        resolve(this.feats)
      })
    }

    // console.log('fetching new feats data')
    // return fs.readFile(this.baseFeatUrl, 'utf8').then((data) => {
    //   this.feats = JSON.parse(data)
    //   this.areFeatsLoaded = true
    //   return JSON.parse(data)
    // })
    const featsFiles: string[] = await this.getFiles(this.dirName)

    const promises = featsFiles.map((file) => fs.readFile(file, 'utf8').then((data) => JSON.parse(data)))
    return new Promise((resolve, reject) => {
      Promise.all(promises).then((data) => {
        ;(this.feats = data.flat()), (this.areFeatsLoaded = true), resolve(data.flat())
      })
    })
  }

  private async getFiles(directory: string) {
    const subDirs = await fs.readdir(directory)
    const files: string[] = (
      await Promise.all(
        subDirs.map(async (dir) => {
          const file = path.resolve(directory, dir)
          return (await fs.stat(file)).isDirectory() ? this.getFiles(file) : file
        })
      )
    ).flat()
    return files.reduce((array, file) => array.concat(file), [] as string[])
  }
}
