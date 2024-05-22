import { ClassData } from 'rpg-app-shared-package'
import { getFiles } from '../helpers/get-files'
import path from 'path'
import * as fs from 'fs/promises'

export class ClassDataLoader {
  private classData: ClassData[] = []
  private isClassDataLoaded: boolean = false
  private readonly dirName: string = path.join(__dirname, '../storage/classes-data/')

  public getClassesData(): Promise<ClassData[]> {
    return this.loadClassDataFromFile()
  }

  public getClassData(id: string): Promise<ClassData> {
    return this.loadClassDataFromFile().then((data) => data.find((classData) => classData.id === id)!)
  }

  private async loadClassDataFromFile(): Promise<ClassData[]> {
    if (this.isClassDataLoaded) {
      console.log('returning classData from cache')
      return new Promise((resolve) => {
        resolve(this.classData)
      })
    }

    const classDataFiles: string[] = await getFiles(this.dirName)

    const promises = classDataFiles.map((file) => fs.readFile(file, 'utf8').then((data) => JSON.parse(data)))
    return new Promise((resolve) => {
      Promise.all(promises).then((data) => {
        this.classData = data.flat()
        this.isClassDataLoaded = true
        resolve(data.flat())
      })
    })
  }
}
