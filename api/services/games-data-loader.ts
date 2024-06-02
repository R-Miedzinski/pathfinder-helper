import { Game } from 'rpg-app-shared-package/dist/public-api'
import { JsonDataLoader } from './json-data-loader'

export class GamesLoader extends JsonDataLoader<Game> {
  constructor() {
    super()
    this.dirName = this.dirName + 'games/'
  }

  public getUserGames(charIds: string[]): Promise<Game[]> {
    return this.loadDataFromFile().then((data) =>
      data.filter((entry) => entry.characters.some((id) => charIds.includes(id)))
    )
  }
}
