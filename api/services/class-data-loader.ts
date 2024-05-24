import { ClassData } from 'rpg-app-shared-package'
import { JsonDataLoader } from './json-data-loader'

export class ClassDataLoader extends JsonDataLoader<ClassData> {
  constructor() {
    super()
    this.dirName = this.dirName + 'classes-data/'
  }

  public getClassesData(): Promise<ClassData[]> {
    return this.loadDataFromFile()
  }

  public getClassData(id: string): Promise<ClassData> {
    return this.loadDataFromFile().then((data) => data.find((classData) => classData.id === id)!)
  }
}
