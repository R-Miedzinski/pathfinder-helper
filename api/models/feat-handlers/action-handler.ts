import { Character } from 'rpg-app-shared-package/dist/public-api'
import { FeatHandler } from '../feat-handler'

export class ActionHandler extends FeatHandler {
  public handleFeat(character: Character): void {
    const action: string = this._payload.actionId

    character.actions?.push(action)
  }
}
