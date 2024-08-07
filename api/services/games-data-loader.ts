import { Game } from 'rpg-app-shared-package/dist/public-api'
import { MongoDBDataLoader } from './mongo-db-data-loader'
import { Collection } from 'mongodb'

export class GamesLoader extends MongoDBDataLoader<Game> {
  constructor(
    db: Collection,
    private __user_code: string
  ) {
    super(db)
  }

  public getUserGames(): Promise<Game[]> {
    return this.db.find<Game>({ users: { $all: [this.__user_code] } }).toArray()
  }
}
