import { getFiles } from '../helpers/get-files'
import * as fs from 'fs'
import path from 'path'
import { CRUDController } from '../controllers/crud-controller'

export abstract class JsonDataLoader<T extends { id: string }> implements CRUDController<T> {
  protected isDataLoaded: boolean = false
  protected data: T[] = []
  protected dirName: string = path.join(__dirname, '../storage/')

  public create(entry: T): string {
    const fileUrl = `${this.dirName}/${entry.id}.json`

    try {
      fs.writeFileSync(fileUrl, JSON.stringify(entry), { encoding: 'utf8', flag: 'wx' })
      return 'Success'
    } catch (err) {
      throw new Error(`Failure in creating new entry: ${entry.id} :: ${err}`)
    }
  }

  public read(id: string): T {
    try {
      const files = fs.readdirSync(`${this.dirName}`, { recursive: true, encoding: 'utf8' })

      const fileUrl = files.find((url) => url.endsWith(`${id}.json`))

      if (fileUrl) {
        return JSON.parse(fs.readFileSync(this.dirName + fileUrl, { encoding: 'utf8' }))
      } else {
        throw new Error('No file found')
      }
    } catch (err) {
      throw new Error(`Failure in reading entry: ${id} :: ${err}`)
    }
  }

  public readAll(): T[] {
    try {
      const files = fs.readdirSync(`${this.dirName}`, { recursive: true, encoding: 'utf8' })

      return files
        .filter((file) => file.includes('.json'))
        .map((file) => JSON.parse(fs.readFileSync(this.dirName + file, { encoding: 'utf8' })))
    } catch (err) {
      throw new Error(`Failure in reading all items :: ${err}`)
    }
  }

  public update(id: string, entry: T): T {
    const fileUrl = `${this.dirName}/${id}.json`

    try {
      fs.writeFileSync(fileUrl, JSON.stringify(entry), { encoding: 'utf8', flag: 'w' })
      return entry
    } catch (err) {
      throw new Error(`Failure in updating new entry: ${id} :: ${err}`)
    }
  }

  public delete(id: string): string {
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

    const promises = dataFiles.map((file) => fs.promises.readFile(file, 'utf8').then((data) => JSON.parse(data)))
    return new Promise((resolve) => {
      Promise.all(promises).then((data) => {
        this.data = data.flat()
        this.isDataLoaded = true
        resolve(data.flat())
      })
    })
  }
}
