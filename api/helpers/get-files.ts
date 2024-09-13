import * as fs from 'fs/promises'
import path from 'path'

export async function getFiles(directory: string) {
  const subDirs = await fs.readdir(directory)
  const files: string[] = (
    await Promise.all(
      subDirs.map(async (dir) => {
        const file = path.resolve(directory, dir)
        return (await fs.stat(file)).isDirectory() ? getFiles(file) : file
      })
    )
  ).flat()
  return files.reduce((array, file) => array.concat(file), [] as string[])
}
