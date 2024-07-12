import { ActionSource, CharacterAction } from 'rpg-app-shared-package/dist/public-api'
import * as fs from 'fs'
import { JsonDataLoader } from './json-data-loader'

export class ActionsLoader extends JsonDataLoader<CharacterAction> {
  private actionDirectories: Record<ActionSource, string> = {
    [ActionSource.BASE]: 'base',
    [ActionSource.CLASS]: 'class',
    [ActionSource.FEAT]: 'feat',
    [ActionSource.OTHER]: 'other',
  }

  constructor() {
    super()
    this.dirName = this.dirName + 'actions/'
  }

  public create(entry: CharacterAction): string {
    const fileUrl = `${this.dirName}/${this.actionDirectories[entry.source]}/${entry.id}.json`

    try {
      fs.writeFileSync(fileUrl, JSON.stringify(entry), { encoding: 'utf8', flag: 'wx' })
      return `Action added: ${entry.id}`
    } catch (err) {
      throw new Error(`Failure in creating new entry: ${entry.id} :: ${err}`)
    }
  }

  public update(id: string, entry: CharacterAction): CharacterAction {
    const fileUrl = `${this.dirName}/${this.actionDirectories[entry.source]}/${id}.json`

    try {
      fs.writeFileSync(fileUrl, JSON.stringify(entry), { encoding: 'utf8', flag: 'w' })
      return entry
    } catch (err) {
      throw new Error(`Failure in updating new entry: ${id} :: ${err}`)
    }
  }

  public getActions(ids: string[]): Promise<CharacterAction[]> {
    return this.loadDataFromFile().then((data) => {
      const toGet = ids
      return toGet.map((id) => data.filter((entry) => entry.id === id)).flat()
    })
  }

  public getBasicActionsIds(): string[] {
    const dirUrl = `${this.dirName}/${this.actionDirectories[ActionSource.BASE]}/`
    try {
      const files = fs.readdirSync(dirUrl)

      return files
        .map((item) => {
          const action: CharacterAction = JSON.parse(fs.readFileSync(dirUrl + item, { encoding: 'utf8' }))
          return action.id
        })
        .filter(Boolean)
    } catch (err) {
      throw new Error(`Failure in loading base actions :: ${err}`)
    }
  }
}
