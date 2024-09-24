import { Game } from 'rpg-app-shared-package/dist/public-api'
import { MongoDBDataLoader } from './mongo-db-data-loader'
import { Collection, ObjectId } from 'mongodb'

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

  public findGamesByName(nameSearch: string, user: string): Promise<Game[]> {
    return this.db
      .find<Game>({ $and: [{ name: { $regex: nameSearch, $options: 'i' } }, { users: { $nin: [user] } }] })
      .toArray()
  }

  public joinGame(id: string, user: string): Promise<{ message: string }> {
    return this.db.updateOne({ _id: new ObjectId(id) }, { $push: { users: user } }).then((data) => {
      return { message: 'Game updated successfully' }
    })
  }
}
