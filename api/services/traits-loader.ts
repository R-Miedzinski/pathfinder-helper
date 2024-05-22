import { Trait } from 'rpg-app-shared-package'
import { getFiles } from '../helpers/get-files'
import path from 'path'
import * as fs from 'fs/promises'

export class TraitsLoader {
  private traits: Trait[] = []
  private areTraitsLoaded: boolean = false
  private readonly dirName: string = path.join(__dirname, '../storage/traits/')

  public getTrait(id: string): Promise<Trait> {
    return this.loadTraitsFromFile().then(
      (data) =>
        data.find((trait) => trait.id === id.toLocaleLowerCase()) ?? {
          id,
          name: 'NOT_FOUND',
          description: `Trait with id ${id} not found`,
        }
    )
  }

  private async loadTraitsFromFile(): Promise<Trait[]> {
    if (this.areTraitsLoaded) {
      console.log('returning traits from cache')
      return new Promise((resolve) => {
        resolve(this.traits)
      })
    }

    const traitsFiles: string[] = await getFiles(this.dirName)

    const promises = traitsFiles.map((file) => fs.readFile(file, 'utf8').then((data) => JSON.parse(data)))
    return new Promise((resolve) => {
      Promise.all(promises).then((data) => {
        this.traits = data.flat()
        this.areTraitsLoaded = true
        resolve(data.flat())
      })
    })
  }
}
