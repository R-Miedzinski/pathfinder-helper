import { ClassData, DisplayInitClassData, DisplayLevelUpClassData } from 'rpg-app-shared-package'
import { MongoDBDataLoader } from './mongo-db-data-loader'
import { Collection } from 'mongodb'

export class ClassDataLoader extends MongoDBDataLoader<ClassData> {
  constructor(db: Collection) {
    super(db)
  }

  public getInitClassData(id: string): Promise<DisplayInitClassData> {
    return this.read(id).then((entry) => {
      return { id: entry._id, name: entry.name, ...entry.initData }
    })
  }

  public getLevelUpClassData(name: string): Promise<DisplayLevelUpClassData> {
    return this.db.findOne({ name }).then((entry) => {
      if (entry) {
        return { id: entry._id, name: entry.name, ...entry.levelUpData }
      } else {
        throw Error(`No class ${name} found`)
      }
    })
  }
}
