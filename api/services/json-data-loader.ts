import { getFiles } from '../helpers/get-files'
import * as fs from 'fs/promises'
import path from 'path'

export abstract class JsonDataLoader<T> {
  protected isDataLoaded: boolean = false
  protected data: T[] = []
  protected dirName: string = path.join(__dirname, '../storage/')

  protected async loadDataFromFile(): Promise<T[]> {
    if (this.isDataLoaded) {
      console.log('returning classData from cache')
      return new Promise((resolve) => {
        resolve(this.data)
      })
    }

    const dataFiles: string[] = await getFiles(this.dirName)

    const promises = dataFiles.map((file) => fs.readFile(file, 'utf8').then((data) => JSON.parse(data)))
    return new Promise((resolve) => {
      Promise.all(promises).then((data) => {
        this.data = data.flat()
        this.isDataLoaded = true
        resolve(data.flat())
      })
    })
  }
}
