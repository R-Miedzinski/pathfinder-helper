import { Collection, DeleteResult, InsertOneResult, UpdateResult } from 'mongodb'
import { CRUDController } from '../controllers/crud-controller'

export abstract class MongoDBDataLoader<T extends { id: string }> implements CRUDController<T> {
  constructor(protected db: Collection) {}

  public create(entry: T): Promise<InsertOneResult> {
    return this.db.insertOne(entry)
  }

  public read(id: string): Promise<T> {
    return this.db.findOne<T>({ id }).then((item) => {
      if (item) {
        return item
      }

      throw Error(`Item with id: ${id} not found`)
    })
  }

  public readAll(): Promise<T[]> {
    return this.db
      .find<T>({})
      .toArray()
      .then((items) => (items != null ? items : []))
  }

  public update(id: string, entry: T): Promise<UpdateResult<T>> {
    return this.db.updateOne({ id }, entry)
  }

  public delete(id: string): Promise<DeleteResult> {
    return this.db.deleteOne({ id })
  }
}
