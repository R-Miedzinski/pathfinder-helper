import { Trait } from 'rpg-app-shared-package'
import { MongoDBDataLoader } from './mongo-db-data-loader'
import { Collection } from 'mongodb'

export class TraitsLoader extends MongoDBDataLoader<Trait> {
  constructor(db: Collection) {
    super(db)
  }

  public async read(id: string): Promise<Trait> {
    return super.read(id).catch(() => {
      console.log('creating default trait')
      return {
        _id: id,
        name: 'Placeholder',
        description: `Trait with id ${id} not found`,
      }
    })
  }
}
