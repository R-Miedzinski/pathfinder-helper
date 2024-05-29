import { ClassData, DisplayInitClassData, DisplayLevelUpClassData } from 'rpg-app-shared-package'
import { JsonDataLoader } from './json-data-loader'

export class ClassDataLoader extends JsonDataLoader<ClassData> {
  constructor() {
    super()
    this.dirName = this.dirName + 'classes-data/'
  }

  public getClassesData(): Promise<ClassData[]> {
    return this.loadDataFromFile()
  }

  public getInitClassData(id: string): Promise<DisplayInitClassData> {
    return this.loadDataFromFile().then((data) => {
      const entry = data.find((classData) => classData.id === id)!

      return { id: entry.id, name: entry.name, ...entry.initData }
    })
  }

  public getLevelUpClassData(id: string): Promise<DisplayLevelUpClassData> {
    return this.loadDataFromFile().then((data) => {
      const entry = data.find((classData) => classData.id === id)!

      return { id: entry.id, name: entry.name, ...entry.levelUpData }
    })
  }
}
