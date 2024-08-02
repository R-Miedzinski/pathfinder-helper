import { ActionSource, CharacterAction, CharacterActionType, Skills } from 'rpg-app-shared-package/dist/public-api'
import { MongoDBDataLoader } from './mongo-db-data-loader'
import { Collection } from 'mongodb'

export class ActionsLoader extends MongoDBDataLoader<CharacterAction> {
  constructor(db: Collection) {
    super(db)
  }

  public getActions(ids: string[]): Promise<CharacterAction[]> {
    return this.db.find<CharacterAction>({ id: { $in: ids } }).toArray()
  }

  public async getBasicActionsIds(): Promise<string[]> {
    try {
      const actions = await this.db.find<CharacterAction>({ source: ActionSource.BASE }).toArray()

      return actions
        .map((action) => {
          return action.type !== CharacterActionType.skilled ? action.id : ''
        })
        .filter(Boolean)
    } catch (err) {
      throw new Error(`Failure in loading base actions :: ${err}`)
    }
  }

  public async getSkilledActionsIds(skills: Skills[]): Promise<string[]> {
    try {
      console.log('getSkilledAction called with skills:', skills)
      const allSkilledActions = await this.db.find<CharacterAction>({ type: CharacterActionType.skilled }).toArray()

      return allSkilledActions
        .filter((action) => (action.skill ? skills.includes(action.skill) : false))
        .map((action) => action.id)
    } catch (err) {
      throw new Error(`Failure in loading skilled actions :: ${err}`)
    }
  }
}
