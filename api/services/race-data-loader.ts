import { RaceData } from 'rpg-app-shared-package/dist/public-api'
import { MongoDBDataLoader } from './mongo-db-data-loader'
import { Collection } from 'mongodb'

export class RaceDataLoader extends MongoDBDataLoader<RaceData> {
  constructor(db: Collection) {
    super(db)
  }

  public getRaceDataList(): Promise<RaceData[]> {
    return this.readAll()
  }

  public getRaceData(name: string): Promise<RaceData> {
    return this.db.findOne<RaceData>({ name }).then((data) => {
      if (data) {
        return data
      }

      throw Error(`Race data for: ${name} not found`)
    })
  }
}
