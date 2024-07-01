import { Classes, Feat, FeatCategory, Race } from 'rpg-app-shared-package'
import * as fs from 'fs'
import { JsonDataLoader } from './json-data-loader'

export class FeatFetcher extends JsonDataLoader<Feat> {
  private categoryDirectories: Record<FeatCategory, string> = {
    [FeatCategory.ancestry]: 'race',
    [FeatCategory.bonus]: 'bonus',
    [FeatCategory.choice]: 'class',
    [FeatCategory.class]: 'class',
    [FeatCategory.feature]: 'class',
    [FeatCategory.general]: 'general',
    [FeatCategory.heritage]: 'race',
    [FeatCategory.skill]: 'skill',
    [FeatCategory.special]: 'bonus',
  }

  constructor() {
    super()
    this.dirName = this.dirName + 'feats/'
  }

  public create(entry: Feat): string {
    const fileUrl = `${this.dirName}/${this.categoryDirectories[entry.category]}/${entry.id}.json`

    try {
      fs.writeFileSync(fileUrl, JSON.stringify(entry), { encoding: 'utf8', flag: 'wx' })
      return `Feat added: ${entry.id}`
    } catch (err) {
      throw new Error(`Failure in creating new entry: ${entry.id} :: ${err}`)
    }
  }

  public read(id: string): Feat {
    // const fileUrl = `${this.dirName}/${this.categoryDirectories[entry.category]}/${id}.json`

    try {
      const files = fs.readdirSync(`${this.dirName}`, { recursive: true, encoding: 'utf8' })

      const fileUrl = files.find((url) => url.endsWith(`${id}.json`))

      if (fileUrl) {
        return JSON.parse(fs.readFileSync(this.dirName + fileUrl, { encoding: 'utf8' }))
      } else {
        throw new Error('No file found')
      }
    } catch (err) {
      throw new Error(`Failure in reading entry: ${id} :: ${err}`)
    }
  }

  public update(id: string, entry: Feat): Feat {
    const fileUrl = `${this.dirName}/${this.categoryDirectories[entry.category]}/${id}.json`

    try {
      fs.writeFileSync(fileUrl, JSON.stringify(entry), { encoding: 'utf8', flag: 'w' })
      return entry
    } catch (err) {
      throw new Error(`Failure in updating new entry: ${id} :: ${err}`)
    }
  }

  public getFeatData(id: string): Promise<Feat | undefined> {
    return this.loadDataFromFile().then((data) => data.find((item) => item.id === id))
  }

  public getAncestryFeats(race: Race, level: number): Promise<Feat[]> {
    return this.loadDataFromFile().then((data) =>
      data.filter(
        (item) =>
          item.category === FeatCategory.ancestry &&
          +item.level <= +level &&
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
          +item.level <= +level &&
          item.traits?.includes(charClass.toLocaleLowerCase()) &&
          item.category === FeatCategory.class
      )
    )
  }

  public getClassFeatures(charClass: Classes, level: number): Promise<Feat[]> {
    return this.loadDataFromFile().then((data) =>
      data.filter(
        (item) =>
          +item.level <= +level &&
          item.traits?.includes(charClass.toLocaleLowerCase()) &&
          item.category === FeatCategory.feature
      )
    )
  }

  public getFeatsByQuery(level: number, category: FeatCategory, trait?: string): Promise<Feat[]> {
    return this.loadDataFromFile().then((data) =>
      data.filter(
        (item) =>
          +item.level <= +level &&
          item.category === category &&
          (!trait || item.traits?.includes(trait.toLocaleLowerCase()))
      )
    )
  }
}
