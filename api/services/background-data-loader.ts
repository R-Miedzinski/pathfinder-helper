import { BackgroundData } from 'rpg-app-shared-package/dist/public-api'
import { MongoDBDataLoader } from './mongo-db-data-loader'
import { Collection } from 'mongodb'

export class BackgroundDataLoader extends MongoDBDataLoader<BackgroundData> {
  constructor(db: Collection) {
    super(db)
  }

  public getBackgroundDataIdArray(): Promise<{ id: string; name: string }[]> {
    return this.readAll().then((data) => data.map((entry) => ({ id: entry._id, name: entry.name })))
  }
}
