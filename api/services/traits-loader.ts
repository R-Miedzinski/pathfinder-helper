import { Trait } from 'rpg-app-shared-package'
import { MongoDBDataLoader } from './mongo-db-data-loader'
import { Collection } from 'mongodb'

export class TraitsLoader extends MongoDBDataLoader<Trait> {
  constructor(db: Collection) {
    super(db)
  }

  public async read(id: string): Promise<Trait> {
    return super.read(id).catch(() => {
      return {
        id,
        name: id
          .split('-')
          .map((word) => word[0].toUpperCase() + word.slice(1))
          .join(' '),
        description: `Trait with id ${id} not found`,
      }
    })
  }
}
