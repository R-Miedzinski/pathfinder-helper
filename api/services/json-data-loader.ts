import { getFiles } from '../helpers/get-files'
import * as fs from 'fs/promises'
import path from 'path'
import { CRUDController } from '../controllers/crud-controller'

export abstract class JsonDataLoader<T extends { id: string }> implements CRUDController<T> {
  protected isDataLoaded: boolean = false
  protected data: T[] = []
  protected dirName: string = path.join(__dirname, '../storage/')

  public create(entry: T): Promise<string> {
    const fileUrl = `${this.dirName}/${entry.id}.json`

    return fs.writeFile(fileUrl, JSON.stringify(entry), { encoding: 'utf8', flag: 'wx' }).then(() => 'Success')
  }

  public async read(id: string): Promise<T> {
    const files = await fs.readdir(`${this.dirName}`, { recursive: true, encoding: 'utf8' })

    const fileUrl = files.find((url) => path.basename(url) === `${id}.json`)

    if (fileUrl) {
      return fs.readFile(this.dirName + fileUrl, { encoding: 'utf8' }).then((data: string): T => JSON.parse(data))
    } else {
      throw new Error('No file found')
    }
  }

  public async readAll(): Promise<T[]> {
    const files = fs.readdir(`${this.dirName}`, { recursive: true, encoding: 'utf8' })

    const promises = await files.then((items) =>
      items
        .filter((file) => file.includes('.json'))
        .map((file) => fs.readFile(this.dirName + file, { encoding: 'utf8' }))
    )

    const jsonItems = Promise.all(promises)

    return jsonItems.then((items) => items.map((item: string): T => JSON.parse(item)))
  }

  public update(id: string, entry: T): Promise<T> {
    const fileUrl = `${this.dirName}/${id}.json`

    return fs.writeFile(fileUrl, JSON.stringify(entry), { encoding: 'utf8', flag: 'w' }).then(() => entry)
  }

  public delete(id: string): Promise<string> {
    throw new Error('Method not implemented.')
  }

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
